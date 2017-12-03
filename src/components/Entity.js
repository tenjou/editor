import { component, componentVoid, elementOpen, elementClose, elementVoid, text, store } from "wabi"
import ComponentDropdown from "./ComponentDropdown"
import TextInput from "./TextInput"
import NumberInput from "./NumberInput"
import Component from "../system/Component"

const Entity = component
({
	mount() 
	{
		this.menu = null
		this.attrAddComponent = {
			onclick: this.handleAddComponent.bind(this)
		}	
	},

	render() 
	{
		const components = this.$value

		elementOpen("entity")
			elementOpen("items")
				for(let n = 0; n < components.length; n++) {
					const component = components[n]
					this.renderComponent(component, n)
				}
			elementClose("items")

			elementOpen("row")
				this.menu = componentVoid(ComponentDropdown, { bind: { source: "components" }})
				elementOpen("button", this.attrAddComponent)
					text("Add component")
				elementClose("button")
			elementClose("row")
		elementClose("entity")
	},

	renderComponent(component, index)
	{
		const data = component.data
		const asset = store.data.assets[component.id]
		const attribs = asset.attribs
		const attr = {
			onclick: (event) => {
				store.remove(`${this.bind}/${index}`)
			}
		}

		elementOpen("header")
			text(asset.name)
			elementOpen("button", attr)
				elementVoid("icon", { class: "fa fa-remove" })
			elementClose("button")			
		elementClose("header")
		elementOpen("items")
			const bind = `${this.bind}/${index}/data/`
			for(let n = 0; n < attribs.length; n++) {
				this.renderItem(attribs[n], data, bind)
			}
		elementClose("items")
	},

	renderItem(attrib, data, componentBind)
	{
		const bind = `${componentBind}${attrib.name}`

		elementOpen("item")
			elementOpen("name")
				text(attrib.name)
			elementClose("name")
			switch(attrib.type) {
				case "Number":
					componentVoid(NumberInput, { bind })
					break				
				case "String":
					componentVoid(TextInput, { bind })
					break
			}
			
		elementClose("item")
	},

	handleAddComponent(event) 
	{
		const id = this.menu.$value
		if(!id) { return }

		const data = Component.clone(id)
		if(!data) {	
			console.warn(`(Entity.handleAddComponent) Could not get component data from id: ${this.menu.$value}`)
			return
		}

		this.menu.$value = null
		store.add(this.bind, { id, data })
	}
})

export default Entity