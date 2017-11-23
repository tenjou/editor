import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid,
	text
} from "wabi"

import Word from "./Word"
import Export from "../actions/export"

export default component(
{
	mount() {
		this.attrHome = { onclick: this.handleHomeClick.bind(this) }
		this.attrExport = { onclick: this.handleExportClick.bind(this) }
		this.attrSettings = { class: "fa fa-cog", onclick: this.handleSettings.bind(this) }
	},

	render() {
		elementOpen("navbar")
			elementOpen("home", this.attrHome)
				text("meta")
			elementClose("home")

			elementOpen("export", this.attrExport)
				text("export")
			elementClose("export")

			elementOpen("right-side")
				elementVoid("settings", this.attrSettings)
			elementClose("right-side")
		elementClose("navbar")
	},

	handleHomeClick(event) {
		document.location.href = `${location.origin}/${location.pathname}`
	},

	handleExportClick(event) {
		Export.exportZip()
	},

	handleSettings() {

	}
})
