import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import Commander from "../Commander"

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
		elementOpen("workspace", { class: "panel" })
			elementOpen("header")
				text("Workspace")
			elementClose("header")

			const workspaceId = this.$id
			if(workspaceId)
			{
				elementOpen("content")	
					const element = elementOpen("div").element
					elementClose("div")	
				elementClose("content")

				if(!this.quill) {
					this.quill = new Quill(element, { theme: "snow" })
					this.quill.on("text-change", (delta, oldDelta, source) => {
						if(source === "user") {
							Commander.execute("SaveWorkspace", this.quill.root.innerHTML)
						}
					})
				}

				if(this.$content) {
					this.quill.root.innerHTML = this.$content
					this.quill.update()	
				}
			}
			else {
				elementOpen("content", { class: "centered" })	
					text("Workspace is empty")
				elementClose("content")
			}
		elementClose("workspace")
	}
})

export default Workspace