import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import Cmder from "../Cmder"
import Assets from "../actions/Assets"
import SaveWorkspaceCommand from "~/commands/SaveWorkspace"

const Workspace = component
({
	state: {
		id: null,
		content: null
	},

	mount() {
		this.bind = {
			id: "local/workspace",
			content: "workspace"
		}
		this.simplemde = null
	},

	render() 
	{	
		const workspaceId = this.$id

		elementOpen("workspace", { class: "panel" })
			elementOpen("header")
				if(workspaceId) {
					text(Assets.buildPath(store.data.assets[workspaceId]))
				}
				else {
					text("Workspace")
				}
			elementClose("header")

			const attrContent = workspaceId ? null : { class: "hidden" }

			elementOpen("content", attrContent)	
				const element = elementOpen("div").element
				elementClose("div")	
			elementClose("content")

			if(!this.quill) {
				this.quill = new Quill(element, { theme: "snow" })
				this.quill.on("text-change", (delta, oldDelta, source) => {
					if(source === "user") {
						Cmder.execute(SaveWorkspaceCommand, this.quill.root.innerHTML)
					}
				})
			}

			if(!workspaceId) {
				elementOpen("content", { class: "centered" })	
					text("Workspace is empty")
				elementClose("content")
			}
			else {
				this.quill.root.innerHTML = this.$content ? this.$content : null
				this.quill.update()	
			}
		elementClose("workspace")
	}
})

export default Workspace