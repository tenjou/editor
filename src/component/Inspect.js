import { component, componentVoid, elementOpen, elementClose, text } from "wabi"

const Inspect = component
({
	mount() {
		this.attr = { 
			style: "flex: 0 0 300px;",
			oncontextmenu(event) {
				ContextMenu.show(event, "Hierarchy")
			}			
		}
	},

	render() 
	{
		const items = this.$value

		elementOpen("panel", this.attr)
			elementOpen("inspect")
				elementOpen("header")
					text("Inspect")
				elementClose("header")
			elementClose("inspect")
		elementClose("panel")
	}
})

export default Inspect