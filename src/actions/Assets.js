import { store } from "wabi"
import Hierarchy from "./Hierarchy"
import Types from "./Types"
import FileSystem from "../fs/FileSystem"
import Persistence from "../Persistence"
import { dataURItoBlob } from "../Utils"
import Log from "../Log"

const dataFilePostfix = ".data"
const dataFilePostfixLength = dataFilePostfix.length

let assets = {}
let assetsChildren = {}
let filesToUpload = null
let fileToUploadId = -1
let newResourcesFound = false
let numActions = 0
let onSyncDone = null
let prevLocation = null
let foldersRemoving = {}
let blobsWaiting = {}
let blobsFolders = {}
let blobsAssets = {}
let blobsMasterFolder = {}
let numEntriesPreparing = 0

const createAsset = (type) => {
	const parent = prevLocation
	const asset = Types.create(type, parent)
	store.dispatch({
		action: "ADD_ITEM",
		value: asset,
		key: "assets"
	})
}

const removeAsset = (path) => {
	store.remove(path)
}

const removeAssetSelected = () => {
	removeAsset(store.get("local/selected"))
}

const createFileData = (file, parent) => {
	const wildcardIndex = file.name.lastIndexOf(".")
	const basename = file.name.substring(0, wildcardIndex)
	const ext = file.name.substring(wildcardIndex + 1).toLowerCase()
	const asset = Types.createFromExt(ext, parent)
	asset.name = basename
	return asset
}

const upload = () => {
	const uploadElement = document.getElementById("assets-upload")
	if(!uploadElement) {
		console.error("Assets.upload) Could not find upload element")
		return
	}
	uploadElement.click()
}

const uploadFiles = (files) => {
	filesToUpload = files
	fileToUploadId = 0
	uploadNextFile()
}

const uploadNextFile = () => {
	const nextFile = filesToUpload[fileToUploadId++]
	if(!nextFile) { return }
	readFile(nextFile, uploadNextFile, null)
}

const readFile = (file, onDone, parent) => {
	const reader = new FileReader()
	reader.onload = (fileResult) => {
		writeFile(file, fileResult, parent)
		if(onDone) {
			onDone()
		}
	}
	reader.readAsDataURL(file)
}

const entryPrepared = () => {
	numEntriesPreparing--
	if(numEntriesPreparing === 0) {
		const bulk = []
		for(let masterFolderId in blobsMasterFolder) {
			const folder = blobsFolders[masterFolderId]
			for(let key in folder) {
				bulk.push(blobsAssets[key])
				delete blobsAssets[key]
			}
		}
		store.dispatch({
			action: "ADD_BULK",
			key: "assets",
			value: bulk
		})
		blobsMasterFolder = {}
	}
}

const dropFiles = (files, parent) => 
{
	blobsFolders[parent] = {}
	blobsMasterFolder[parent] = true

	for(let n = 0; n < files.length; n++) {
		const entry = files[n].webkitGetAsEntry()
		if(entry) {
			numEntriesPreparing++
			dropFiles_traverseDir(entry, parent)
		}
	}
}

const dropFiles_traverseDir = (entry, parent) => 
{
	if(entry.isFile) {
		numEntriesPreparing++
		entry.file((file) => {
			readFile(file, null, parent)
		})
	}
	else if(entry.isDirectory) 
	{
		const folder = createItemData("Folder", null, parent)
		const meta = folder.meta
		meta.name = entry.name
		blobsAssets[meta.id] = folder
		blobsFolders[parent][meta.id] = folder
		blobsFolders[meta.id] = {}

		const dirReader = entry.createReader()
		numEntriesPreparing++
		dirReader.readEntries((entries) => {
			for(let n = 0; n < entries.length; n++) {
				numEntriesPreparing++
				dropFiles_traverseDir(entries[n], folder.meta.id)
			}
			entryPrepared()
		})
	}

	entryPrepared()
}

const writeFile = (file, fileResult, parent) => {
	const blob = dataURItoBlob(fileResult.target.result, file.type)
	const asset = createFileData(file, parent || prevLocation)
	blobsFolders[parent][asset.id] = asset
	blobsWaiting[asset.id] = blob
	blobsAssets[asset.id] = asset
	entryPrepared()
}

const findFirstOfType = (type) => 
{
	let buffer = store.data.assets
	for(let key in buffer) {
		const item = buffer[key]
		if(item.type === type) {
			return item
		}
		else if(item.type === "Folder") {
			const result = findFirstOfType(type)
			if(result) {
				return result
			}
		}
	}

	return null
}

const performAdd = (payload) => 
{
	const asset = payload.value
	const filePath = buildPath(asset)
	const dataPath = filePath + ".data"

	Persistence.onIoDone(() => {
		handlePayload(asset, payload)
	})

	if(asset.type === "Folder") 
	{
		const blobFolder = blobsFolders[asset.id]
		if(blobFolder) 
		{
			const bulk = []
			for(let key in blobFolder) {
				bulk.push(blobsAssets[key])
				delete blobsAssets[key]
			}
			delete blobsFolders[asset.id]

			Persistence.onIoDone(() => {
				store.dispatch({
					action: "ADD_BULK",
					key: "assets",
					value: bulk
				})
			})
		}

		Persistence.createFolder(filePath)
	}
	else if(asset.ext) 
	{
		const blob = blobsWaiting[asset.id]
		if(!blob) { return }
		delete blobsWaiting[asset.id]

		Persistence.writeBlob(filePath, blob)
	}

	Persistence.writeJSON(dataPath, asset)
}

const performUpdate = (payload, buffer) =>
{
	const asset = store.data.assets[buffer[1]]
	if(!asset) { return }

	const path = buildPartialPath(asset)

	let basePath = `${path}/${asset.name}`
	if(asset.ext) {
		basePath = `${basePath}.${asset.ext}`
	}

	asset.updated = Date.now()
	
	if(buffer[2] === "name")
	{
		if(payload.value === asset.name) { 
			store.handle(payload)
			return 
		}

		store.handle(payload)
		Persistence.onIoDone(() => {
			store.set(`assetsChildren/${asset.parent}`, assetsChildren[asset.parent])
		})				

		let newPath = `${path}/${payload.value}`

		Persistence.writeJSON(`${basePath}.data`, asset)

		if(asset.type === "Folder") {
			Persistence.renameFolder(basePath, newPath)
		}
		else if(asset.ext) {
			newPath = `${newPath}.${asset.ext}`
			Persistence.rename(basePath, newPath)
		}
		
		Persistence.writeJSON(`${basePath}.data`, asset)
		Persistence.rename(`${basePath}.data`, `${newPath}.data`)
	}
	else {
		store.handle(payload)
		Persistence.writeJSON(`${basePath}.data`, asset)
	}
}

const performRemove = (payload) =>
{
	const asset = store.get(payload.key)
	const path = buildPath(asset)

	if(prevLocation === asset.id) {
		const parent = store.assets[asset.parent]
		if(parent) {
			store.set("local/assets/location", asset.parent)
		}
		else {
			store.set("local/assets/location", "")
		}
	}

	if(!isParentFolderRemoving(path))
	{
		if(asset.type === "Folder")
		{
			foldersRemoving[path] = true

			Persistence.removeFolder(path)
			Persistence.remove(`${path}.data`)

			const children = assetsChildren[assets.parent]
			for(let key in children) {
				store.remove(`assets/${key}`)
			}

			store.remove(`assetsChildren/${asset.parent}/${asset.id}`)
			delete foldersRemoving[path]
		}
		else {
			store.remove(`assetsChildren/${asset.parent}/${asset.id}`)
			if(asset.ext) {
				Persistence.remove(path)
			}
			Persistence.remove(`${path}.data`)
		}
	}
	else if(asset.type === "Folder")
	{
		const children = assetsChildren[assets.parent]
		for(let key in children) {
			store.remove(`assets/${key}`)
		}
		store.remove(`assetsChildren/${asset.parent}/${asset.id}`)
	}
}

const move = function(parent, item)
{
	if(parent === item) { return }

	store.dispatch({
		action: "MOVE",
		key: "assets",
		value: {
			parent,
			item
		}
	})
}

const performMove = (payload) => 
{
	const parent = assets[payload.value.parent]
	const item = assets[payload.value.item]
	const parentPath = buildPath(parent)
	const itemPath = buildPath(item)
	const prevParentId = item.parent

	let newPath = `${parentPath}/${item.name}`
	if(item.ext) {
		newPath = `${newPath}.${item.ext}`
	}
	
	item.updated = Date.now()
	item.parent = payload.value.parent
	if(payload.value.name) {
		item.name = payload.value.name
	}

	Persistence.writeJSON(`${itemPath}.data`, item)
	Persistence.rename(`${itemPath}.data`, `${newPath}.data`)
	
	delete assetsChildren[prevParentId][item.id]
	let children = assetsChildren[item.parent]
	if(!children) {
		children = {}	
	}
	children[item.id] = item
	
	if(item.type === "Folder") {
		Persistence.renameFolder(itemPath, newPath)
	} 
	else if(item.ext) {
		Persistence.rename(itemPath, newPath)
	}

	Persistence.onIoDone(() => {
		store.handle({
			action: "SET",
			key: `assets/${item.id}`,
			value: item
		})
		store.set(`assetsChildren/${item.parent}`, children)
		store.set(`assetsChildren/${prevParentId}`, assetsChildren[prevParentId])
	})
	Persistence.updateIo()
}

const handlePayload = (asset, payload) => 
{
	let children = assetsChildren[asset.parent]
	if(!children) {
		children = {}
		assetsChildren[asset.parent] = children
	}
	children[asset.id] = asset

	store.handle(payload)
	store.set(`assetsChildren/${asset.parent}`, children)
}

const syncingCallback = (error, content) => 
{
	numActions--
	if(numActions === 0) {
		store.set("assets", assets)
		store.set("assetsChildren", assetsChildren)
		onSyncDone()
		onSyncDone = null
	}
}

const syncingRemoveItem = (file, path) => 
{
	numActions++
	if(file.isDirectory) {
		FileSystem.removeDirectory(path, syncingCallback)
	}
	else {
		FileSystem.remove(path, syncingCallback)
	}
}

const sync = function(onDone)
{
	onSyncDone = onDone

	const parentFolder = Types.create("Folder")
	parentFolder.id = ""
	parentFolder.name = ""
	assets[""] = parentFolder
	syncDirectory(parentFolder, "assets")
}

const syncDirectory = function(parent, path) {
	numActions++
	FileSystem.readDirectory(path, (error, data) => {
		syncDirectoryCallback(error, data, parent, path)
		syncingCallback(null, null)
	})
}

const syncDirectoryCallback = function(error, data, parent, path)
{
	if(error) {
		Log.error("Assets.handleInitialLoad", error)
		return
	}

	const filesDict = {}
	for(let n = 0; n < data.length; n++) {
		const file = data[n]
		filesDict[file.name] = file
	}

	for(let n = 0; n < data.length; n++) 
	{
		const file = data[n]
		if(!filesDict[file.name]) { continue }

		const filePath = `${path}/${file.name}`
		const dataFileIndex = file.name.lastIndexOf(dataFilePostfix)
		if(dataFileIndex === file.name.length - dataFilePostfixLength) {
			numActions++
			const index = file.name.lastIndexOf(".")
			const name = file.name.slice(0, index)
			const contentFile = filesDict[name]
			if(contentFile) {
				filesDict[name] = null
			}
			FileSystem.read(filePath, (error, json) => {
				syncReadMetaCallback(error, json, parent, path, file, contentFile)
				syncingCallback(error, json)
			})
		}
		else {
			syncingRemoveItem(file, filePath)
		}
	}
}

const syncReadMetaCallback = function(error, json, parent, path, file, contentFile)
{
	if(error) {
		Log.error("FailedLoadMeta", `Could not load meta file: ${metaFilePath}`)
		return
	}

	const data = JSON.parse(json)

	if((data.ext || data.type === "Folder") && !contentFile) {
		syncingRemoveItem(file, `${path}/${file.name}`)
		return
	}

	assets[data.id] = data
	
	let children = assetsChildren[data.parent]
	if(!children) {
		children = {}
		assetsChildren[parent.id] = children
	}
	children[data.id] = data

	if(data.type === "Folder") {
		syncDirectory(data, `${path}/${data.name}`)
	}
}

const buildPath = function(asset)
{
	if(!asset) { return "" }

	let path = buildPartialPath(asset) + `/${asset.name}`
	if(asset.type !== "Folder") {
		if(asset.ext) {
			path += `.${asset.ext}`
		}
	}

	return path
}

const buildPartialPath = function(asset)
{
	if(!asset.parent) {
		return `assets`
	}

	const assets = store.data.assets
	let path = ""
	let parent = assets[asset.parent]
	for(;;) {
		path = `/${parent.name}${path}`
		if(!parent.parent) { break }
		parent = assets[parent.parent]
	}
	path = `assets${path}`

	return path
}

const watchLocation = (payload) =>
{
	if(prevLocation !== null) {
		store.set(`assets/${prevLocation}/cache/selectedDirectory`, false)
	}
	prevLocation = payload.value
	if(prevLocation !== null) {
		const asset = assets[prevLocation]
		if(asset) {
			store.set(`assets/${prevLocation}/cache/selectedDirectory`, true)
		}
		else {
			store.set("local/assets/location", "")
		}
	}
}

const isParentFolderRemoving = (path) => {
	for(let key in foldersRemoving) {
		if(path.indexOf(key) === 0) {
			return true
		}
	}
	return false
}

const openSelected = () => {
	const item = store.get(store.get("local/selected"))
	const type = Types.get(item.type)
	if(!type) {
		console.warn(`(Assets.openSelected) No such type registered: ${type}`)
		return
	}
	if(!type.open) {
		console.warn(`(Assets.openSelected) No open function defined for type: ${type}`)
		return
	}
	type.open.call(item)
}

store.watch("local/assets/location", watchLocation)

export default {
	createAsset,
	removeAsset,
	removeAssetSelected,
	upload,
	uploadFiles,
	dropFiles,
	findFirstOfType,
	open,
	move,
	sync,
	buildPath,
	buildPartialPath,
	performAdd,
	performUpdate,
	performRemove,
	performMove,
	openSelected
}