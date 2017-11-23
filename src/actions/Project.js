import { store, update, lastSegment } from "wabi"
import Persistence from "../Persistence"
import Assets from "./Assets"
import Types from "./Types"
import Server from "../server/Server"
import FileSystem from "../fs/FileSystem"
import Hierarchy from "./Hierarchy"
import Status from "./Status"
import StatusMsg from "../StatusMsg"
import { isEmpty } from "../Utils"

let activeProject = null

const create = function(name, type, onDone)
{
	const data = {
		name, 
		type,
		path: null,
		lastId: 0
	}

	const callback = (data) => {
		createLocal(data, onDone)
	}

	if(window.electron) 
	{
		const dialog = require("electron").remote.dialog
		dialog.showOpenDialog({ properties: [ "openDirectory" ]}, 
			(paths) => {
				if(paths) {
					data.path = paths[0]
					Server.createProject(data, callback)
				}
			})
	}
	else {
		Server.createProject(data, callback)
	}
}

const createLocal = function(data, onDone)
{
	const directoryPath = data.path ? data.path : data.id

	FileSystem.createDirectory(directoryPath, (error, url) => {
		if(error) {
			console.error(`(Project.createLocal) Error while creating root directory: ${directoryPath}`, error)
			return
		}

		const dbPath = `${directoryPath}/db`
	
		FileSystem.createDirectory(dbPath, (error, url) => {
			if(error) {
				console.error(`(Project.createLocal) Error while creating root directory: ${dbPath}`, error)
				return
			}

			FileSystem.write(`${dbPath}/project.json`, JSON.stringify(data), (error, url) => {
				if(error) {
					console.error(`(Project.createLocal) Error while saving 'project.db' in directory: ${dbPath}`, error)
					return
				}

				const assetsPath = `${directoryPath}/assets`
				FileSystem.createDirectory(assetsPath, (error, url) => {
					if(error) {
						console.error(`(Project.createLocal) Error while creating assets directory: ${assetsPath}`, error)
						return
					}

					if(onDone) {
						onDone(data)
					}
				})
			})
		})
	})
}

const remove = function(id) 
{
	const projects = store.get("projects/data")
	const data = projects[id]
	if(!data) {
		console.error("(Project.remove) Project not found with id:", id)
		return
	}

	const rootPath = data.path ? data.path : data.id

	FileSystem.removeDirectory(rootPath,
		(error) => {
			if(error) {
				console.error("(Project.remove) Error while removing directory:", rootPath)
				return
			}

			store.set("projects/selected", null)
			store.remove(`projects/data/${id}`)
		})
}

const removeSelected = function()
{
	const selected = store.get("projects/selected")
	if(!selected) {
		console.error("(Project.removeSelected) No project selected")
		return
	}

	remove(selected)
}

const rename = function(id, name) {
	Server.renameProject({ id, name }, handleRename)
}

const handleRename = function(data) 
{
	const project = store.get(`projects/data/${data.id}`)
	const rootPath = project.path ? project.path : project.id
	const path = `${rootPath}/db/project.json`

	FileSystem.write(path, JSON.stringify(project), (error, url) => {
		if(error) {
			console.error("(Project.handleRename) Error while writing in:", path)
			return
		}
	})
}

const open = function(id)
{
	const project = store.get(`projects/data/${id}`)
	if(!project) {
		console.error("(Project.open) No such project found with id:", id)
		return
	}

	document.location.hash = id
}

const load = function(url)
{
	Status.log(`${StatusMsg.Project.OPENING} ${url}`)
	Status.startLoading()

	FileSystem.rootDirectory = url
	FileSystem.checkDirectory("", (error, data) => {
		if(error) {
			Status.log(`${StatusMsg.Project.NOT_FOUND} ${url}`, Status.ERROR)
			console.error(error)
			return
		}

		Assets.sync(() => {
			Persistence.storage("project").loadDB(url, false)
			Persistence.storage("local").loadDB(url, true)
			Status.endLoading()
		})
	})
}

const unload = function(onDone)
{
	// if(!activeProject) {
	// 	console.error("(Project.unload) No project opened")
	// 	if(onDone) { onDone() }
	// 	return
	// }

	// console.log(`Saving: '${activeProject.id}' before exiting`)

	// const path = activeProject.path ? activeProject.path : activeProject.id
	// FileSystem.write(`${path}/db.json`, JSON.stringify(store), (error, data) => {
	// 	if(error) {
	// 		console.error("(Project.unload) Error while writing in:", path)
	// 		return
	// 	}

	// 	needSave = false
	// 	store.set("", {})

	// 	if(onDone) {
	// 		onDone()
	// 	}
	// })
}

// const unload = function(onDone)
// {
// 	console.log(`Saving: '${Project.instance.url}' before exiting`)

// 	FileSystem.write(`${Project.instance.url}/db.json`, JSON.stringify(store), (error, data) => {
// 		if(error) {
// 			console.error(error)
// 			return
// 		}

// 		needSave = false
// 		Project.instance = null
// 		store.set("", {})

// 		if(onDone) {
// 			onDone()
// 		}
// 	})
// }

const fetch = function() 
{
	store.set("projects/loading", true)

	const callback = (projects) => {
		handleFetch(projects)
	}

	if(!window.electron) {
		FileSystem.readDirectory("", (error, data) => {
			if(error) {
				console.error("(Project.fetch) Error while reading root directory")
				return
			}

			fetchLocal(data, callback)
		})
	}
	else {	
		// TODO: Electron project fetch
		callback({})
	}
}

const fetchLocal = function(data, onDone)
{
	const num = data.length
	const projects = {}
	let numToLoad = 0

	if(num > 0) 
	{
		for(let n = 0; n < num; n++)
		{
			const item = data[n]
			if(!item.isDirectory) { continue }

			const projectDbFile = `${item.name}/db/project.json`
			numToLoad++

			FileSystem.read(projectDbFile, (error, data) => {
				if(error) {
					console.warn("(Project.fetchLocal) Error while reading project db file:", projectDbFile)
				}
				else {
					projects[item.name] = JSON.parse(data)
				}

				numToLoad--
				if(numToLoad === 0) {
					if(onDone) {
						onDone(projects)
					}
				}
			})
		}
	}
	else 
	{
		if(onDone) {
			onDone(projects)
		}
	}
}

const handleFetch = function(projects) {
	store.set("projects/data", projects)
	store.set("projects/loading", false)
}

const getActive = function() {
	return activeProject
}

const start = function() 
{
	store.globalProxy = (payload) => {
		if(payload.key.indexOf("assets") === 0) {
			Server.dispatch(payload)
		}
		else {
			store.handle(payload)
		}
	}	
}

store.set("projects", {
	data: null,
	loading: false,
	selected: false
})

// Watch for project renames
store.addProxy("projects/data",
	(payload) => {
		switch(payload.action) {
			case "SET":
			{
				const buffer = payload.key.split("/")
				const lastSegment = buffer[buffer.length - 1]
				const id = buffer[buffer.length - 2]

				if(lastSegment === "name") {
					rename(id, payload.value)
					return
				}
			} break
		}
	})

export default {
	create,
	remove,
	removeSelected,
	rename,
	open,
	load,
	unload,
	fetch,
	getActive,
	start,
}