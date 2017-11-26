import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import Dropdown from "./Dropdown"
import Word from "./Word"

const attribTypes = [ "Number", "String", "Boolean" ]

const ComponentNumberAttrib = component
({
	render() {
		elementOpen("attrib")
			elementOpen("header")
				componentVoid(Word, { $value: this.$value.name })
				elementOpen("button")
					elementVoid("icon", { class: "fa fa-remove" })
				elementClose("button")
			elementClose("header")

			elementOpen("items")
				elementOpen("item")
					elementOpen("name")
						text("type")
					elementClose("name")
					componentVoid(Dropdown, { $source: attribTypes, $value: this.$value.type })	
				elementClose("item")
			elementClose("items")
		elementClose("attrib")
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
		const attribs = [
			{
				name: "MyNumber",
				type: "Number"
			},
			{
				name: "MyString",
				type: "Number"
			}			
		]

		elementOpen("component")
			elementOpen("content", { class: "column" })
				for(let n = 0; n < attribs.length; n++) {
					const attrib = attribs[n]
					componentVoid(componentAttribMap[attrib.type], { $value: attrib })
				}
				
			elementClose("content")

			elementOpen("holder")
				elementOpen("button")
					text("Apply")
				elementClose("button")				
				elementOpen("button")
					text("Add Attribute")
				elementClose("button")
			elementClose("holder")
			
		elementClose("component")
	},

	handleClick(event) {
		store.add(this.bind, "Item")
	}
})

const componentAttribMap = {
	Number: ComponentNumberAttrib
}

export default Component