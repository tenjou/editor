import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"

const ComponentAttributes = component
({
	render() {

	}
})

const Component = component
({
	mount() {
		this.attrAddButton = {
			onclick: this.handleClick.bind(this)
		}
	},

	render() 
	{	
		elementOpen("component")
			elementOpen("button")
				text("Add Attribute")
			elementClose("button")
		elementClose("component")
	},

	handleClick(event) {
		store.add(this.bind, "Item")
	}
})

export default Component