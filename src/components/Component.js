import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import Dropdown from "./Dropdown"
import Word from "./Word"
import TextInput from "./TextInput"
import NumberInput from "./NumberInput"
import Checkbox from "./Checkbox"
import Dropdown from "./Dropdown"
import Drop from "./Drop"
import EnumDropdown from "./EnumDropdown"
import { cloneObj } from "../Utils"

const attribTypes = [ "Number", "String", "Boolean", "Enum", "List", "Image", "Component" ]

const ComponentAttrib = component
({
	state: {
		value: null,
		list: null,
		parentId: null
	},

	mount() {
		this.attrButtonRemove = {
			onclick: (event) => {
				store.remove(this.bind.value)
			}
		}
		this.attrWord = {
			bind: `${this.bind.value}/name`,
			$validateFunc: (newName) => {
				if(this.isValidName(newName)) {
					return newName
				}
				return this.$value.name
			}
		}
	},

	render() {
		elementOpen("attrib")
			elementOpen("header")
				componentVoid(Word, this.attrWord)

				elementOpen("button", this.attrButtonRemove)
					elementVoid("icon", { class: "fa fa-remove" })
				elementClose("button")
			elementClose("header")

			elementOpen("items")
				elementOpen("item")
					elementOpen("name")
						text("type")
					elementClose("name")
					componentVoid(Dropdown, { 
						$source: attribTypes, 
						bind: `${this.bind.value}/type` 
					})	
				elementClose("item")

				switch(this.$value.type) {
					case "Number":
						this.renderNumber()
						break				
					case "String":
						this.renderString()
						break
					case "Boolean":
						this.renderBoolean()
						break
					case "Enum":
						this.renderEnum()
						break
					case "List":
						this.renderList()
						break
					case "Component":
						this.renderComponent()
						break
				}
			elementClose("items")
		elementClose("attrib")
	},

	renderNumber()
	{
		const bind = `${this.bind.value}/value`

		elementOpen("item")
			elementOpen("name")
				text("value")
			elementClose("name")						
			componentVoid(NumberInput, { bind })
		elementClose("item")
	},

	renderString()
	{
		const bind = `${this.bind.value}/value`
		
		elementOpen("item")
			elementOpen("name")
				text("value")
			elementClose("name")						
			componentVoid(TextInput, { bind })
		elementClose("item")
	},

	renderBoolean()
	{
		const bind = `${this.bind.value}/value`
		
		elementOpen("item")
			elementOpen("name")
				text("value")
			elementClose("name")						
			componentVoid(Checkbox, { bind })
		elementClose("item")
	},

	renderEnum()
	{		
		elementOpen("item")
			elementOpen("name")
				text("source")
			elementClose("name")						
			componentVoid(EnumDropdown, { 
				bind: { 
					value: `${this.bind.value}/source`,
					source: "enums" 
				}
			})
		elementClose("item")

		elementOpen("item")
			elementOpen("name")
				text("value")
			elementClose("name")		
			componentVoid(Dropdown, { 
				$sourceRoot: "assets",
				bind: { 
					source: `${this.bind.value}/source`,
					value: `${this.bind.value}/value`
				}
			})
		elementClose("item")	
	},

	renderList()
	{
		elementOpen("item")
			elementOpen("name")
				text("value")
			elementClose("name")
		elementClose("item")
	},

	renderComponent()
	{
		elementOpen("item")
			elementOpen("name")
				text("component")
			elementClose("name")
			componentVoid(Drop, {
				$type: "Component",
				$exclude: this.$parentId,
				bind: {
					value: `${this.bind.value}/value`
				}
			})
		elementClose("item")
	},
	
	isValidName(name) {
		const list = this.$list
		for(let n = 0; n < list.length; n++) {
			if(list[n].name === name) {
				return false
			}
		}
		return true
	}	
})

const Component = component
({
	state: {
		value: null,
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
					componentVoid(ComponentAttrib, { 
						$list: attribs,
						$parentId: this.$value.id,
						bind: { 
							value: `${this.bind.attribsEdited}/${n}` 
						}
					})
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
			id: Date.now(),
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