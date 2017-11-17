import { component, componentVoid, elementOpen, elementClose, route, store } from "wabi"
import Hierarchy from "./component/Hierarchy"
import ContextMenu from "./component/ContextMenu"
import History from "./History"
import Device from "./Device"
import Inspect from "./controllers/Inspect"

const Layout = component
({
	mount() {
		this.attr = {
			oncontextmenu(event) {
				event.preventDefault()
				event.stopPropagation()
				store.set("contextmenu", {
					x: event.clientX,
					y: event.clientY,
					show: true	
				})
			}	
		}
	},

	render() {
		elementOpen("layout", this.attr)
			elementOpen("row")
				componentVoid(Hierarchy, { bind: "hierarchy" })
			elementClose("row")
		elementClose("layout")

		elementOpen("overlay")
			componentVoid(ContextMenu)
		elementClose("overlay")		
	}
})

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
			children: [],
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
