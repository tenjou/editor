import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid,
	text
} from "wabi"

import { Exports } from "../actions/export"
import Checkbox from "./Checkbox"
import Radiobutton from "./Radiobutton"

export default component(
{
	state: {
		type: "Development",
		format: "Compressed"
	},

	mount() {
		this.attrButtonMore = {
			class: "pointer fa fa-times close"
		}
		this.attrHeader = {
			onmousedown: this.startMoveWindow.bind(this),
			onmouseup: this.endMoveWindow.bind(this)
		}
	},

	render() {
		elementOpen("window", { class: "panel" })
			elementOpen("header", this.attrHeader)
				text("Export Settings")
				elementVoid("icon", this.attrButtonMore)	
			elementClose("header")
			componentVoid(Radiobutton)
			componentVoid(Radiobutton)
			componentVoid(Checkbox)
			elementOpen("button")
				text("Export")
			elementClose("button")	
		elementClose("window")
	},

	handleExportClick(event) {
		new Exports({
			type: "Development",
			format: "Compressed"
		}).download()
	},

	startMoveWindow(event) {
		document.addEventListener("mousemove", this.moveWindow.bind(this))
	},

	endMoveWindow(event) {
		console.log("end event")
		document.removeEventListener("mousemove", this.moveWindow.bind(this))
	},

	moveWindow(event) {
		console.log("Mouse down")
	}

})
