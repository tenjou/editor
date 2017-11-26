import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import Dropdown from "./Dropdown"
import Word from "./Word"

const attribTypes = [ "Number", "String", "Boolean" ]

const ComponentAttrib = component
({
	mount() {
		this.attrButtonRemove = {
			onclick: (event) => {
				store.remove(this.bind)
			}
		}
	},

	render() {
		elementOpen("attrib")
			elementOpen("header")
				componentVoid(Word, { bind: `${this.bind}/name` })

				elementOpen("button", this.attrButtonRemove)
					elementVoid("icon", { class: "fa fa-remove" })
				elementClose("button")
			elementClose("header")

			elementOpen("items")
				elementOpen("item")
					elementOpen("name")
						text("type")
					elementClose("name")
					componentVoid(Dropdown, { $source: attribTypes, bind: `${this.bind}/type` })	
				elementClose("item")
			elementClose("items")
		elementClose("attrib")
	}
})

const Component = component
({
	mount() {
		this.attrButtonAdd = {
			onclick: this.handleAdd.bind(this)
		}
		this.attrButtonApply = {
			onclick: this.handleApply.bind(this)
		}
	},

	render() 
	{	
		const attribs = this.$value

		elementOpen("component")
			elementOpen("content", { class: "column" })
				for(let n = 0; n < attribs.length; n++) {
					const attrib = attribs[n]
					componentVoid(ComponentAttrib, { bind: `${this.bind}/${n}` })
				}
			elementClose("content")

			elementOpen("holder")
				elementOpen("button")
					text("Apply")
				elementClose("button")	

				elementOpen("button", this.attrButtonAdd)
					text("Add")
				elementClose("button")
			elementClose("holder")
		elementClose("component")
	},

	handleAdd(event) {
		store.add(this.bind, {
			name: "foo",
			type: attribTypes[0]
		})
	},

	handleApply(event) {

	}
})

export default Component