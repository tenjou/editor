import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import Dropdown from "./Dropdown"
import Word from "./Word"
import TextInput from "./TextInput"
import NumberInput from "./NumberInput"
import { cloneObj } from "../Utils"

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
						text("value")
					elementClose("name")
					const bind = `${this.bind}/value`
					switch(this.$value.type) {
						case "Number":
							componentVoid(NumberInput, { bind })
							break				
						case "String":
							componentVoid(TextInput, { bind })
							break
					}
				elementClose("item")
			elementClose("items")
		elementClose("attrib")
	}
})

const Component = component
({
	state: {
		attribs: null,
		attribsEdited: null,
		isAttribsEdited: false
	},

	mount() {
		this.attrButtonAdd = {
			onclick: this.handleAdd.bind(this)
		}
		this.attrButtonApply = {
			onclick: this.handleApply.bind(this)
		}
		this.attrButtonReset = {
			onclick: this.handleReset.bind(this)
		}
	},

	render() 
	{	
		const attribs = this.$attribsEdited

		elementOpen("component")
			elementOpen("content", { class: "column" })
				for(let n = 0; n < attribs.length; n++) {
					const attrib = attribs[n]
					componentVoid(ComponentAttrib, { bind: `${this.bind.attribsEdited}/${n}` })
				}
			elementClose("content")

			elementOpen("holder")
				if(this.$isAttribsEdited) {
					elementOpen("button", this.attrButtonApply)
						text("Apply")
					elementClose("button")	

					elementOpen("button", this.attrButtonReset)
						text("Reset")
					elementClose("button")	
				}

				elementOpen("button", this.attrButtonAdd)
					text("Add")
				elementClose("button")
			elementClose("holder")
		elementClose("component")
	},

	handleAdd(event) 
	{
		const attribs = this.$attribsEdited
		let name = "attrib"
		let id = 1

		loop:
		for(;;) 
		{
			name = `attrib${id}`
			id++

			for(let n = 0; n < attribs.length; n++) {
				if(attribs[n].name === name) { 
					continue loop;
				}
			}
			
			break
		}

		store.add(this.bind.attribsEdited, {
			name,
			type: attribTypes[0],
			value: 0
		})
	},

	handleApply(event) {
		store.set(this.bind.attribs, cloneObj(this.$attribsEdited))
		store.set(this.bind.isAttribsEdited, false)
	},

	handleReset(event) {
		store.set(this.bind.attribsEdited, cloneObj(this.$attribs))
		store.set(this.bind.isAttribsEdited, false)
	}
})

export default Component