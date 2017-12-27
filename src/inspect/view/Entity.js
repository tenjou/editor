import { component, componentVoid, elementOpen, elementClose, elementVoid, text, store } from "wabi"
import TextInput from "~/component/TextInput"
import NumberInput from "~/component/NumberInput"
import Checkbox from "~/component/Checkbox"
import Dropdown from "~/component/Dropdown"
import ComponentDropdown from "./ComponentDropdown"
import ImagePreview from "./ImagePreview"
import ComponentService from "../service/Component"

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
					const componentInfo = components[n]
					this.renderComponent(componentInfo, n)
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

	renderComponent(componentInfo, index)
	{
		const data = componentInfo.data
		const asset = store.data.assets[componentInfo.component]
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
		componentVoid(EntityComponent)
	},

	handleAddComponent(event) 
	{
		const component = this.menu.$value
		if(!component) { return }

		const data = ComponentService.clone(component)
		if(!data) {	
			console.warn(`(Entity.handleAddComponent) Could not get component data from id: ${this.menu.$value}`)
			return
		}

		this.menu.$value = null
		store.add(this.bind, { component, data })
	}
})

export default Entity