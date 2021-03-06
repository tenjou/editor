import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import Inspect from "../service/Inspect"
import Checkbox from "~/component/Checkbox"
import Dropdown from "~/component/Dropdown"
import NumberInput from "~/component/NumberInput"
import TextInput from "~/component/TextInput"
import Audio from "./Audio"
import Image from "./Image"
import Color from "./Color"
import Component from "./Component"
import Enum from "./Enum"
import Entity from "./Entity"
import Prefab from "./Prefab"

const Category = component
({
	state: {
		props: null,
		bind: null,
		open: true
	},

	mount()
	{
		const handleCaretClickFunc = this.handleCaretClick.bind(this)

		this.attrHeader = {
			onclick: this.handleClick.bind(this)
		}
		this.attrCaretOpen = {
			class: "fa fa-caret-down",
			onclick: handleCaretClickFunc
		}
		this.attrCaretClose = {
			class: "fa fa-caret-right",
			onclick: handleCaretClickFunc
		}			
	},

	render() 
	{
		if(this.$open)
		{
			elementOpen("category")
				elementOpen("header", this.attrHeader)
					elementVoid("caret", this.attrCaretOpen)
					elementOpen("span")
						text(this.$value)
					elementClose("span")
				elementClose("header")

				if(this.$props) {
					componentVoid(Items, { $value: this.$.props, $bind: this.$.bind })
				}
			elementClose("category")
		}
		else 
		{
			elementOpen("category")
				elementOpen("header", this.attrHeader)
					elementVoid("caret", this.attrCaretClose)
					elementOpen("span")
						text(this.$value)
					elementClose("span")
				elementClose("header")
			elementClose("category")
		}
	},

	handleClick(event) 
	{
		if(event.detail % 2 === 0) {
			this.$open = !this.$open
		}
	},

	handleCaretClick(event) {
		event.stopPropagation()
		this.$open = !this.$open
	}
})

const Items = component(
{
	state: {
		bind: null
	},

	render() 
	{
		elementOpen("items")

		const props = this.$value
		const rootBind = this.$bind
		let bind

		for(let n = 0; n < props.length; n++)
		{
			const item = props[n]
			let itemBind = item.bind

			if(itemBind) 
			{
				if(typeof itemBind === "object") {
					bind = {}
					for(let key in itemBind) {
						const path = itemBind[key]
						if(path) {
							bind[key] = `${rootBind}/${path}`
						}
						else {
							bind[key] = rootBind
						}
					}
				}
				else {
					bind = `${rootBind}/${itemBind}`
				}
			}
			else {
				bind = rootBind
			}

			switch(item.type)
			{
				case "Group":
				{
					elementOpen("group")
						elementOpen("row")
							elementOpen("name")
								text(item.name)
							elementClose("name")
							elementVoid("line")
						elementClose("row")
						if(item.children) {
							componentVoid(Items, { $value: item.children, $bind: bind })
						}		
					elementClose("group")
				} break

				case "Number":
				{
					const inputAttr = { bind }
					inputAttr.$min = (item.$min !== undefined) ? item.$min : Number.MIN_SAFE_INTEGER
					inputAttr.$max = (item.$max !== undefined) ? item.$max : Number.MAX_SAFE_INTEGER

					elementOpen("item")
						elementOpen("name")
							text(item.name)
						elementClose("name")
						componentVoid(NumberInput, inputAttr)
					elementClose("item")
				} break

				case "String":
				{
					const inputAttr = { bind }
					if(item.readonly) {
						inputAttr.$readonly = item.readonly
					}

					elementOpen("item")
						elementOpen("name")
							text(item.name)
						elementClose("name")
						componentVoid(TextInput, inputAttr)
					elementClose("item")
				} break

				case "Checkbox":
				{
					const inputAttr = { bind }
					if(item.$default) { inputAttr.$default = item.$default }

					elementOpen("item")
						elementVoid("name", attr)
						componentVoid(Checkbox, inputAttr)
					elementClose("item")
				} break

				case "Dropdown":
				{
					const inputAttr = { 
						bind: {
							value: bind,
							source: item.source
						},
						$emptyOption: (item.$emptyOption !== undefined) ? item.$emptyOption : false,
						$valueIsId: (item.$valueIsId !== undefined) ? item.$valueIsId : true
					}

					if(item.source2) {
						inputAttr.bind.source2 = item.source2
					}

					if(item.$default) { inputAttr.$default = item.$default }

					elementOpen("item")
						elementOpen("name")
							text(item.name)
						elementClose("name")
						componentVoid(Dropdown, inputAttr)
					elementClose("item")
				} break

				case "Image":
				{
					elementOpen("item")
						componentVoid(Image, { 
							bind: {
								value: bind,
								updated: `${bind}/updated` 
							}
						})
					elementClose("item")
				} break

				case "Audio":
				{
					elementOpen("item")
						componentVoid(Audio, { 
							bind: {
								value: bind,
								updated: `${bind}/updated` 
							}
						})
					elementClose("item")
				} break

				case "Component":
				{
					elementOpen("item")
						componentVoid(Component, { 
							bind: {
								value: bind,
								attribs: `${bind}/attribs`,
								attribsEdited: `${bind}/cache/attribs`,
								isAttribsEdited: `${bind}/cache/attribsEdited`
							}
						})
					elementClose("item")
				} break

				case "Enum":
				{
					elementOpen("item")
						componentVoid(Enum, { bind })
					elementClose("item")
				} break		
				
				case "Entity":
				{
					elementOpen("item")
						componentVoid(Entity, { bind })			
					elementClose("item")
				} break

				case "Prefab":
				{
					elementOpen("item")
						componentVoid(Prefab, { bind })
					elementClose("item")
				} break					

				case "Color":
				{
					const inputAttr = { bind }
					if(item.$default) { inputAttr.$default = item.$default }

					elementOpen("item")
						elementVoid("name", attr)
						componentVoid(Color, inputAttr)
					elementClose("item")
				} break

				default:
					console.warn("Unhandled: ", item.type)
					break
			}
		}	

		elementClose("items")	
	}
})

export default component({
	mount() {
		this.attr = { class: "column centered" }
	},
	render()
	{
		elementOpen("inspect", { class: "embeded-panel" })
		
			const props = store.get("inspect/props")
			if(props) 
			{
				const selectedData = Inspect.getSelectedData()
				componentVoid(Category, { 
					$value: selectedData.type.match(/[A-Z][a-z]+/g).join(" "),
					$props: props,
					$bind: this.$.value
				})
			}
			else {
				elementOpen("content", this.attr)
					text("Nothing to inspect")
				elementClose("content")
			}

		elementClose("inspect")
	}
})
