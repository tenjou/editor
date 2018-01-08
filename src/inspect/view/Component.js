import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import AddComponentAttribType from "../command/AddComponentAttribType"
import SetComponentAttribType from "../command/SetComponentAttribType"
import Drop from "./Drop"
import List from "./List"
import Caret from "./Caret"
import ImagePreview from "./ImagePreview"
import EntityComponent from "./EntityComponent"
import EnumDropdown from "./EnumDropdown"
import InspectItem from "./InspectItem"
import Dropdown from "~/component/Dropdown"
import Word from "~/component/Word"
import TextInput from "~/component/TextInput"
import NumberInput from "~/component/NumberInput"
import Checkbox from "~/component/Checkbox"
import Dropdown from "~/component/Dropdown"
import { cloneObj } from "~/Utils"
import Cmder from "~/Cmder"

const attribTypes = [ "Number", "String", "Boolean", "Enum", "List", "Image", "Component" ]

const ComponentAttrib = component
({
	state: {
		value: null,
		list: null,
		parentId: null
	},

	mount() 
	{
		this.attrButtonRemove = {
			onclick: (event) => {
				store.remove(this.bind.value)
			}
		}
		this.attrWord = {
			$validateFunc: (newName) => {
				if(this.isValidName(newName)) {
					return newName
				}
				return this.$value.name
			}
		}
		this.attrDropdown = { 
			$source: attribTypes, 
			$onChange: (type) => {
				Cmder.execute(SetComponentAttribType, {
					id: this.bind.value,
					type
				})
			}	
		}
	},

	render() 
	{
		const attrWord = Object.assign({
			bind: `${this.bind.value}/name`
		}, this.attrWord)
		const attrDropdown = Object.assign({
			bind: `${this.bind.value}/type`
		}, this.attrDropdown)		

		elementOpen("attrib")
			elementOpen("header")
				componentVoid(Word, attrWord)

				elementOpen("button", this.attrButtonRemove)
					elementVoid("icon", { class: "fa fa-remove" })
				elementClose("button")
			elementClose("header")

			elementOpen("items")
				elementOpen("item")
					elementOpen("name")
						text("type")
					elementClose("name")
					componentVoid(Dropdown, attrDropdown)	
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
					case "Image":
						this.renderImage()
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
				text("listType")
			elementClose("name")						
			componentVoid(Dropdown, {
				$source: attribTypes
			})	
		elementClose("item")

		elementOpen("item")
			elementOpen("name")
				text("component")
			elementClose("name")						
			componentVoid(Drop, {
				$type: "Component"
			})
		elementClose("item")

		componentVoid(InspectItem, {
			$type: this.$value.type,
			bind: this.bind.value
		})
	},

	renderComponent()
	{
		const valueBind = `${this.bind.value}/value`

		elementOpen("item")
			elementOpen("name")
				text("component")
			elementClose("name")
			componentVoid(Drop, {
				$type: "Component",
				$exclude: this.$parentId,
				bind: {
					value: `${valueBind}/component`
				}
			})
		elementClose("item")

		elementOpen("item")
			const data = this.$value.value.data
			if(data) {
				elementOpen("line")
					elementOpen("name")
						componentVoid(Caret, { bind: `${valueBind}/cache/open` })
						text("data")
					elementClose("name")
				elementClose("line")

				if(this.$value.value.cache.open) {
					const component = store.data.assets[this.$value.value.component]
					componentVoid(EntityComponent, { 
						$attribs: component.cache.attribs,
						bind: {
							value: `${valueBind}/data`
						}
					})
				}
			}
		elementClose("item")
	},

	renderImage() 
	{
		const bind = `${this.bind.value}/value`
		
		elementOpen("item")
			elementOpen("name")
				text("value")
			elementClose("name")						
			componentVoid(ImagePreview, {
				bind: {
					value: bind
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

		Cmder.execute(AddComponentAttribType, {
			id: this.bind.attribsEdited, 
			name,
			type: attribTypes[0]
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