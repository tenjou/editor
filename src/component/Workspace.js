import { component, componentVoid, elementOpen, elementClose, elementVoid, route, store, text } from "wabi"

const Workspace = component
({
	mount() {
		this.quill = null
	},

	render() 
	{	
		elementOpen("panel")
			elementOpen("workspace")
				elementOpen("content")	
					const element = elementOpen("div").element
						elementOpen("p")
							text("hello world!")
						elementClose("p")
					elementClose("div")	
				elementClose("content")
			elementClose("workspace")
		elementClose("panel")

		if(!this.quill) {
			this.quill = new Quill(element, { theme: 'snow'})
			this.quill.on("text-change", (delta, oldDelta, source) => {
				console.log(this.quill.getText())
			})
		}
	}
})

export default Workspace