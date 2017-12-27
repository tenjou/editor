import { store } from "wabi"
import FileSystem from "./fs/FileSystem"
import Status from "./actions/Status"
import StatusMsg from "./StatusMsg"
import Log from "./Log"

const storages = {}
const storagesUpdated = []
let started = false

const queuedActions = {}
const actions = {}
const actionsOrder = []
let actionIndex = 0
let numIoOps = 0
let waitingOnIo = false
let onIoDoneFuncs = []

class Storage 
{
	constructor(type) 
	{
		this.type = type
		this.needSave = false
		this.seedings = {}
		if(started) {
			this.watch()
		}
	}

	watch() {
		store.addProxy(this.type, (payload) => {
			this.save()
		})		
	}

	loadDB(url, canWrite)
	{
		Status.startLoading()

		const path = `db/${this.type}.json`

		FileSystem.read(path, (error, json) => 
		{
			if(error) {
				this.loadBackupDB(url, canWrite)
			}
			else {
				try {
					const data = JSON.parse(json)
					this.loadFromData(data)
				}
				catch(error) {
					this.loadBackupDB(url, canWrite)
				}
			}

			Status.endLoading()
		})
	}

	loadBackupDB(url, canWrite) 
	{
		Status.startLoading()
		
		const path = `db/${this.type}.json.backup`

		FileSystem.read(path, (error, json) => 
		{
			if(error) {
				if(canWrite) {
					this.writeEmptyData()
				}
				else {
					Status.log(`${StatusMsg.Project.DB_NOT_FOUND} ${url}/${path}`, Status.ERROR)
					console.error(error)
				}
			}
			else {
				try {
					const normalPath = `db/${this.type}.json`
					Persistence.write(normalPath, json)
					const data = JSON.parse(json)
					this.loadFromData(data)
				}
				catch(error) {
					this.writeEmptyData()
				}
			}

			Status.endLoading()
		})
	}

	writeEmptyData() 
	{
		Status.startLoading()

		const path = `db/${this.type}.json`
		const data = this.performSeeding({})

		FileSystem.write(path, JSON.stringify(data), (error, filepath) => {
			if(error) {
				Status.log(`${StatusMsg.Project.DB_CANT_CREATE} ${url}/${path}`, Status.ERROR)
				console.error(error)
			}

			store.set(this.type, data)
		})

		Status.endLoading()
	}

	loadFromData(data) 
	{
		Status.startLoading()

		const seededData = this.performSeeding(data)
		store.set(this.type, seededData)

		Status.endLoading()	
	}

	seed(path, seed)
	{
		path = path || ""

		this.seedings[path] = (data) => 
		{
			let changed = false

			if(!data) {
				data = seed
				changed = true
			}
			else 
			{
				// Remove old keys
				for(let key in data) {
					if(seed[key] === undefined) {
						if(this.seedings[key] == undefined) {
							delete data[key]
							changed = true
						} 
					}
				}

				// Add new keys
				for(let key in seed) {
					if(data[key] === undefined) {
						data[key] = seed[key]
						changed = true
					}
				}
			}

			if(changed) {
				this.save()
			}

			return data
		}
	}

	performSeeding(data)
	{
		for(let key in this.seedings) {
			const seedingFunc = this.seedings[key]
			if(!key) {
				data = seedingFunc(data)
			}
			else {
				data[key] = seedingFunc(data[key])
			}
		}

		return data
	}

	performSave() 
	{
		if(!this.needSave) { return }
		this.needSave = false

		const data = store.data[this.type]
		const path = `db/${this.type}.json`
		const pathBackup = `db/${this.type}.json.backup`

		FileSystem.write(pathBackup, JSON.stringify(data, 4), (error, data) => {
			if(error) {
				console.error(`(Persistence) Error while writing ${this.type} data in: ${pathBackup}`)
				return
			}

			FileSystem.moveTo(pathBackup, path, (error) => {
				if(error) {
					console.error(`(Persistence) Error while renaming: ${pathBackup}`)
					return
				}

				console.log(`(${this.type} saved)`)
			})
		})
	}

	save() 
	{
		if(this.needSave) { return }
		this.needSave = true

		storagesUpdated.push(this)
	}
}

const mainLoop = function() 
{
	if(storagesUpdated.length > 0)
	{
		for(let n = 0; n < storagesUpdated.length; n++) {
			storagesUpdated[n].performSave()
		}

		storagesUpdated.length = 0
	}

	updateIo()
}

const updateIo = function() {
	if(!waitingOnIo) {
		waitingOnIo = true
		nextAction()
	}
}

const start = function() 
{
	if(started) { return }
	started = true

	for(let key in storages) {
		storages[key].watch()
	}

	setInterval(mainLoop, 500)
}

const saveAll = function() 
{
	for(let key in storages) {
		storages[key].save()
	}
}

const storage = function(type)
{
	let store = storages[type]
	if(!store) {
		store = new Storage(type)
		storages[type] = store
	}

	return store
}

const action = (name, func) => {
	actions[name] = func
	actionsOrder.push(name)
}

const nextAction = () => 
{
	const action = actionsOrder[actionIndex++] || null
	if(!action) 
	{
		if(onIoDoneFuncs) {
			for(let n = 0; n < onIoDoneFuncs.length; n++) {
				onIoDoneFuncs[n]()
			}
			onIoDoneFuncs.length = 0
		}
		
		actionIndex = 0
		waitingOnIo = false
	}
	else {
		handleAction(action)
	}
}

const handleAction = (action) => 
{
	const buffer = queuedActions[action]
	if(buffer) 
	{
		const actionFunc = actions[action]
		for(let key in buffer) {
			numIoOps++
			actionFunc(key, buffer[key])
		}

		queuedActions[action] = null
	}

	if(numIoOps === 0) {
		nextAction()
	}
}

const queueAction = (action, key, value) => 
{
	let buffer = queuedActions[action]
	if(!buffer) {
		buffer = {}
		queuedActions[action] = buffer
	}
	buffer[key] = value
}

const onIoDone = function(func) {
	onIoDoneFuncs.push(func)
}

const handleActionCallback = (error, url) => {
	numIoOps--
	if(error) {
		console.error(error)
	}
	nextAction()
}

action("createFolder", (path, value) => {
	FileSystem.createDirectory(path, handleActionCallback)
})
action("removeFolder", (path, value) => {
	FileSystem.removeDirectory(path, handleActionCallback)
})
action("renameFolder", (prevPath, newPath) => {
	FileSystem.moveToDirectory(prevPath, newPath, handleActionCallback)	
})
action("write", (path, data) => {
	FileSystem.write(path, data, handleActionCallback)
})
action("writeJSON", (path, data) => {
	const json = JSON.stringify(data, null, "\t")
	FileSystem.write(path, json, handleActionCallback)
})
action("writeBlob", (path, blob) => {
	FileSystem.writeBlob(path, blob, handleActionCallback)
})
action("remove", (path, value) => {
	FileSystem.remove(path, handleActionCallback)
})
action("rename", (prevPath, newPath) => {
	FileSystem.moveTo(prevPath, newPath, handleActionCallback)
})

const write = (path, content) => {
	queueAction("write", path, content)
}
const writeJSON = (path, content) => {
	queueAction("writeJSON", path, content)
}
const writeBlob = (path, blob) => {
	queueAction("writeBlob", path, blob)
}
const rename = (prevPath, newPath) => {
	queueAction("rename", prevPath, newPath)
}
const remove = (path) => {
	queueAction("remove", path, true)
}
const createFolder = (filePath) => {
	queueAction("createFolder", filePath, true)
}
const renameFolder = (prevPath, newPath) => {
	queueAction("renameFolder", prevPath, newPath)
}
const removeFolder = (path) => {
	queueAction("removeFolder", path, true)
}

export {
	start,
	saveAll,
	storage,
	write,
	writeJSON,
	writeBlob,
	remove,
	rename,
	createFolder,
	removeFolder,
	renameFolder,
	updateIo,
	onIoDone
}