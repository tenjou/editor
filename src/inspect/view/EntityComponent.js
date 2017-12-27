import { component, componentVoid, elementOpen, elementClose, elementVoid, text, store } from "wabi"
import ImagePreview from "./ImagePreview"
import Checkbox from "~/component/Checkbox"
import Dropdown from "~/component/Dropdown"
import NumberInput from "~/component/NumberInput"
import TextInput from "~/component/TextInput"

const EntityComponent = component
({
	state: {
		attribs: null,
		value: null
	},

	render() {
		elementOpen("items")
			const attribs = this.$attribs
			for(let n = 0; n < attribs.length; n++) {
				this.renderItem(attribs[n])
			}
		elementClose("items")
	},

	renderItem(attrib)
	{
		const bind = `${this.bind.value}/${attrib.name}`

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
				case "Boolean":
					componentVoid(Checkbox, { bind })
					break	
				case "Enum":
					componentVoid(Dropdown, { 
						$sourceRoot: "assets",
						$source: attrib.source,
						bind: {
							value: bind
						}
					})
					break
				case "Image":
					componentVoid(ImagePreview, {
						bind: {
							value: bind
						}
					})
					break
				case "Component":
					// componentVoid(Entity, {
					// 	bind
					// })	
					break		
			}
			
		elementClose("item")
	}	
})

export default EntityComponent