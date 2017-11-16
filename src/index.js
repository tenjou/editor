import { component, componentVoid, elementOpen, elementClose, route, store } from "wabi"
import Hierarchy from "./component/Hierarchy"
import ContextMenu from "./component/ContextMenu"
import History from "./History"
import Device from "./Device"

const Layout = component
({
	mount() {
		this.attr = {
			oncontextmenu(event) {
				console.log("here")
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

export default function main() {
	store.set("hierarchy", [
		{
			id: "item1",
			type: "Folder",
			name: "Folder 1",
			local: {}
		},
		{
			id: "item2",
			type: "Folder",
			name: "Folder 2",
			local: {
				open: true
			}
		},		
		{
			id: "item3",
			type: "Folder",
			name: "Folder 3",
			local: {}
		}		
	])

	route("/", Layout)
	window.store = store

	window.addEventListener("keydown", handleKeyDown)
}
