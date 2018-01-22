import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import EntityComponent from "./EntityComponent"
import ComponentDropdown from "./ComponentDropdown"
import ComponentService from "../service/Component"

const ComponentList = component
({
	mount() {
		this.menu = null
		this.attrAddComponent = {
			onclick: this.handleAddComponent.bind(this)
		}
	},

	render() 
	{
		const components = this.$value

		for(let n = 0; n < components.length; n++) {
			const componentInfo = components[n]
			this.renderComponent(componentInfo, n)
		}

		elementOpen("row")
			this.menu = componentVoid(ComponentDropdown, { bind: { source: "components" }})
			elementOpen("button", this.attrAddComponent)
				text("Add component")
			elementClose("button")
		elementClose("row")		
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
		componentVoid(EntityComponent, {
			$attribs: attribs,
			bind: {
				value: `${this.bind}/${index}/data`
			}
		})
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

export default ComponentList