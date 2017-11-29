import { store } from "wabi"
import Translator from "./Translator"
import FileSystem from "../fs/FileSystem"
import Status from "../actions/Status"
import { uuid4 } from "../Utils"

const dispatch = (payload) => {
	const buffer = payload.key.split("/")
	if(buffer[0] === "assets") {
		switch(payload.action) 
		{
			case "ADD_ITEM": {
				if(buffer.length > 2) {
					Translator.dispatch(payload)
				}
				else {
					const result = createItem(payload.value)
					Translator.dispatch(result)
				}
			} break
				
			case "ADD_BULK": {
				const result = createItems(payload)
				Translator.dispatch(result)
			} break

			case "SET":
			{
				if(buffer[2] === "name") {
					renameItem(payload, buffer[1])
				}
				else {
					Translator.dispatch(payload)
				}
			} break

			case "REMOVE":
				removeItem(payload)
				break

			case "MOVE":
				moveItem(payload)
				break

			default:
			Translator.dispatch(payload)
				break
		}
	}
}

const createItem = (asset) => 
{
	const children = store.data.assetsChildren[asset.parent] || null
	let nameLowercased = asset.name.toLowerCase()
	let newName = nameLowercased
	let index = 1
	
	mainloop:
	for(;;)
	{
		for(let key in children) {
			const item = children[key]
			const name = item.name.toLowerCase()
			if(name === newName && item.ext === asset.ext) {
				index++
				newName = `${nameLowercased} ${index}`
				continue mainloop
			}
		}
		break
	}

	if(index > 1) {
		asset.name = `${asset.name} ${index}`
	}

	return {
		action: "SET",
		key: `assets/${asset.id}`,
		value: asset
	}
}

const createItems = (payload) => {
	const buffer = payload.value
	const result = new Array(buffer.length)
	for(let n = 0; n < buffer.length; n++) {
		result[n] = createItem(buffer[n])
	}
	return result
}

const removeItem = (payload) => {
	Translator.dispatch(payload)
}

const renameItem = (payload, id) => 
{
	const result = [ payload ]
	const asset = store.data.assets[id]
	const children = store.data.assetsChildren[asset.parent]
	
	for(let key in children) {
		const item = children[key]
		if(item.name === payload.value) {
			const prevFilename = asset.ext ? `${asset.name}.${asset.ext}` : asset.name
			const newFilename = asset.ext ? `${payload.value}.${asset.ext}` : payload.value
			result.push({
				action: "ADD",
				key: "status/log",
				value: {
					level: Status.WARN,
					text: `Can not move asset from '${prevFilename}' to '${newFilename}'. Destination path name does already exist.`
				}
			})
			payload.value = asset.name
			break
		}
	}

	Translator.dispatch(result)
}

const moveItem = (payload) => {
	const storeData = store.data
	const parent = storeData.assets[payload.value.parent]
	const item = storeData.assets[payload.value.item]
	if(parent.id === item.parent) { return }

	const children = storeData.assetsChildren[parent.id]
	if(children) 
	{
		const nameBuffer = item.name.split(" ")
		const segments = nameBuffer.length
		let index = 1
		if(segments > 1) {
			index = parseInt(nameBuffer[segments - 1])
			if(isNaN(index)) {
				index = 1
			}
			else {
				nameBuffer.pop()
			}
		}
		else {
			index = 1
		}

		const name = nameBuffer.join(" ")
		const nameLowercased = name.toLowerCase()
		let newName = (index === 1) ? nameLowercased : `${nameLowercased} ${index}`
		
		mainloop:
		for(;;)
		{
			for(let key in children) {
				const child = children[key]
				const name = child.name.toLowerCase()
				if(name === newName && child.ext === item.ext) {
					index++
					newName = `${nameLowercased} ${index}`
					continue mainloop
				}
			}
				
			break
		}

		if(index > 1) {
			payload.value.name = `${name} ${index}`
		}
	}

	Translator.dispatch(payload)
}

const createProject = function(data, onDone)
{
	const timestamp = Date.now()
	data.id = uuid4()
	data.created = timestamp
	data.updated = timestamp
	data.version = 1

	if(onDone) {
		onDone(data)
	}
}

const removeProject = function(data, onDone)
{

}

const renameProject = function(data, onDone)
{
	if(onDone) {
		onDone(data)
	}
}

const createVirtualData = function(name, type)
{
	const dirItems = store.get("assets")
	let nameNew = name
	let fileIndex = 2

	for(;;) {
		if(dirItems[nameNew]) {
			nameNew = `${name} ${fileIndex++}`
			continue
		}
		break
	}

	const data = createData(nameNew, type)
	return data
}

export {
	dispatch,
	createItem,
	removeItem,
	createProject,
	removeProject,
	renameProject	
}