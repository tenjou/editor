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
			const attrContent = this.$id ? null : { class: "hidden" }

			elementOpen("content", attrContent)	
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

			if(!this.$id) {
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