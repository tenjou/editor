import { component, componentVoid, elementOpen, elementClose, elementVoid, text, store } from "wabi"
import Dropdown from "./Dropdown"

const Entity = component
({
	mount() 
	{
		this.components = []

		const assets = store.data.assets
		for(let key in assets) {
			const asset = assets[key]
			if(asset.type === "Component") {
				this.components.push(asset.name)
			}
		}
	},

	render() 
	{
		elementOpen("entity")
			componentVoid(Dropdown, { bind: { source: "components" }})
		elementClose("entity")
	}
})

export default Entity