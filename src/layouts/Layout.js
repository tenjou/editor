import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid,
	text
} from "wabi"

import Project from "../actions/Project"
import Status from "../actions/Status"

import Navbar from "../component/Navbar"
import Hierarchy from "../component/Hierarchy"
import Assets from "../component/assets/Assets"
import Inspect from "../inspect/view/Inspect"
import Word from "../component/Word"
import Workspace from "../component/Workspace"
import Overlay from "../component/Overlay"
import StatusBar from "../component/StatusBar"

const marginRight = { style: { borderRight: "3px solid #010008" }}

export default component(
{
	state: {
		project: null,
		status: null,
		scene: null
	},

	mount() 
	{
		this.bind = {
			project: "project",
			status: "status",
			scene: "local/scene"
		}
		this.attrInspect = { bind: "local/selected" }
	},

	render()
	{
		if(this.$.status.loading) 
		{
			const log = this.$.status.log
	
			elementOpen("loading")
				if(log.length > 0) {
					const entry = log[log.length - 1]
					elementOpen("status", (entry.level === Status.ERROR) ? { class: "error" } : null)
						elementOpen("name")
							text(entry.text)
						elementClose("name")
					elementClose("status")
				}
			elementClose("loading")
		}
		else 
		{
			elementOpen("layout")
				componentVoid(Navbar)
				this.renderProject()
				componentVoid(StatusBar, { bind: "status/log" })
			elementClose("layout")

			componentVoid(Overlay)
		}
	},

	renderProject()
	{
		const localSceneId = this.$.scene

		this.propsInspectColumn = { style: { maxWidth: "380px" } }

		elementOpen("content")
			elementOpen("column", marginRight)
				elementOpen("row", { style: "flex: 100%;" })
					elementOpen("column")
						componentVoid(Workspace)
					elementClose("column")
				elementClose("row")

				elementOpen("row", { style: { flex: "500px", borderTop: "3px solid #010008" }})
					componentVoid(Assets, { bind: "assets" })
				elementClose("row")
			elementClose("column")

			elementOpen("column", this.propsInspectColumn)
				componentVoid(Inspect, this.attrInspect)
			elementClose("column")
		elementClose("content")
	}
})
