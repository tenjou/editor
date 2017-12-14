import { componentVoid, update, route, clearRoutes, store } from "wabi"
import FileSystem from "./fs/FileSystem"
import Persistence from "./Persistence"
import Server from "./server/Server"
import HomeLayout from "./layouts/HomeLayout"
import Layout from "./layouts/Layout"
import WarnLayout from "./layouts/WarnLayout"
import NewProjectLayout from "./layouts/NewProjectLayout"
import Project from "./actions/Project"
import Status from "./actions/Status"
import Types from "./types/index"
import "./menu/Assets"
import "./menu/Project"
import "./Migration"
import "./system/Component"
import "./system/Prefab"
import "./system/Enum"
import "./system/Workspace"

if(process && process.versions && process.versions.electron) {
	window.electron = true
}
else {
	window.electron = false 
}

function Listener(func, owner) {
	this.func = func
	this.owner = owner
}

const listeners = {}
let needSave = false

const setup = function() 
{
	window.store = store
	
	route("", WarnLayout, null, null, () => {
		FileSystem.init((error) => 
		{
			if(error) {
				console.error(error)
				return
			}

			ready()
		})		
	})
}

const ready = function()
{
	clearRoutes()

	route(/#new-project/g, NewProjectLayout)

	if(window.electron)
	{
		route(/^#[a-zA-Z]:\\([a-zA-Z0-9._-]+\\)*\w*/g, Layout, 
			(result) => {
				loadView_Project(result[0][0].slice(1))
			})
	}
	else
	{
		route(/#([a-zA-Z0-9_]*)/g, Layout,
			(result) => {
				loadView_Project(result[0][1])
			})
	}

	route("", HomeLayout)
}

const on = function(event, func, owner) 
{
	const listener = new Listener(func, owner)

	const buffer = listeners[event]
	if(!buffer) {
		listeners[event] = [ listener ]
	}
	else {
		buffer.push(listener)
	}
}

const emit = function(event)
{
	const buffer = listeners[event]
	if(!buffer) { return }

	for(let n = 0; n < buffer.length; n++) {
		const listener = buffer[n]
		listener.func.call(listener.owner)
	}
}

const loadView_Project = function(url) {
	Project.load(url)
}

const start = function(payload)
{
	if(!payload.value) 
	{
		Persistence.start()
		Status.clear()

		store.globalProxy = (payload) => {
			if(payload.key === "assets" || payload.key.indexOf("assets/") === 0) {
				Server.dispatch(payload)
			}
			else {
				store.handle(payload)
			}
		}		
	}
}

store.watch("status/loading", start)

export {
	setup,
	on
}