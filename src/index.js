import { component, componentVoid, elementOpen, elementClose, route, store, text } from "wabi"
import Layout from "./layouts/Layout"
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

export default function main() 
{
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
	route("/", Layout)

	window.store = store
	window.addEventListener("keydown", handleKeyDown)
}
