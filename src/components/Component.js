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

				elementOpen("item")
					elementOpen("name")
						text("default")
					elementClose("name")
					elementVoid("input", { type: "text" })	
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
		const attribs = this.$value.attribsEdited

		elementOpen("component")
			elementOpen("content", { class: "column" })
				const bind = `${this.bind}/attribsEdited`
				for(let n = 0; n < attribs.length; n++) {
					const attrib = attribs[n]
					componentVoid(ComponentAttrib, { bind: `${bind}/${n}` })
				}
			elementClose("content")

			elementOpen("holder")
				elementOpen("button", this.attrButtonApply)
					text("Apply")
				elementClose("button")	

				elementOpen("button", this.attrButtonAdd)
					text("Add")
				elementClose("button")
			elementClose("holder")
		elementClose("component")
	},

	handleAdd(event) {
		store.add(`${this.bind}/attribsEdited`, {
			name: "foo",
			type: attribTypes[0]
		})
	},

	handleApply(event) {
		store.set(`${this.bind}/attribs`, this.$value.attribsEdited)
	}
})

export default Component