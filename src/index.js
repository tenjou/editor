import { component, componentVoid, elementOpen, elementClose, route, clearRoutes, store, text } from "wabi"
import FileSystem from "./fs/FileSystem"
import MainView from "./view/MainView"
import HomeView from "./view/HomeView"
import NewProjectView from "./view/NewProjectView"
import WarnView from "./view/WarnView"
import History from "./History"
import Device from "./Device"
import Inspect from "./controllers/Inspect"
import "./menu/index"

const handleKeyDown = (event) => {
	switch(event.keyCode) {
		// case 46: 
		// 	if(!Editor.selected) { return }
		// 	if(!Editor.selected.parent) { return }
		// 	History.execute(new Commands.RemoveObject(Editor.selected))
		// 	break

		case 90: // Ctrl-Z (undo) or Ctrl-Shift-Z (redo)
			if(Device.isMAC ? event.metaKey : event.ctrlKey) {
				if(event.shiftKey) {
					History.redo()
				}
				else {
					History.undo()
				}
			}
			break
	}
}

const setup = () => 
{
	route("", WarnView, null, null, () => {
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

const ready = () =>
{
	clearRoutes()
	
	const assets = {
		item1: {
			id: "item1",
			type: "Folder",
			name: "Folder 1",
			children: [ "item3" ],
			cache: {}	
		},
		item2: {
			id: "item2",
			type: "Folder",
			name: "Folder 2",
			cache: {
				open: true
			}
		},
		item3: {
			id: "item3",
			type: "Folder",
			name: "some_other_folder",
			children: [ "item4" ],
			parent: "item1",
			cache: {}
		},
		item4: {
			id: "item4",
			type: "Folder",
			name: "item4",
			parent: "item3",
			cache: {}
		}		
	}
	const hierarchy = [
		"item1", "item2"
	]
	const cache = {}
	
	store.addProxy("assets", (payload) => 
	{
		const buffer = payload.key.split("/").reverse()
		buffer.pop()

		const itemId = buffer.pop()
		const key = buffer.pop()
		if(key === "cache") {
			const cacheKey = buffer.pop()
			if(cacheKey === "selected") {
				if(payload.value) {
					Inspect.select(itemId)
				}
				else {
					Inspect.unselect(itemId)
				}
			}
		}
	})

	store.set("assets", assets)
	store.set("hierarchy", hierarchy)
	store.set("cache", cache)

	route(/#new-project/g, NewProjectView)
	route(/#([a-zA-Z0-9_]*)/g, MainView, (result) => {
		// loadView_Project(result[0][1])
	})
	route("", MainView)

	window.store = store
	window.addEventListener("keydown", handleKeyDown)
}

export default function main() {
	setup()
}
