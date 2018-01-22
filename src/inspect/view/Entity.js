import { component, componentVoid, elementOpen, elementClose, elementVoid, text, store } from "wabi"
import TextInput from "~/component/TextInput"
import NumberInput from "~/component/NumberInput"
import Checkbox from "~/component/Checkbox"
import Dropdown from "~/component/Dropdown"
import Drop from "./Drop"
import ComponentList from "./ComponentList"

const Entity = component
({
	state: {
		value: null,
		prefab: null
	},

	render()
	{
		elementOpen("entity")
			elementOpen("items")
				elementOpen("item")
					elementOpen("name")
						text("prefab")
					elementClose("name")
					componentVoid(Drop, {
						$type: "Prefab",
						bind: this.bind.prefab
					})
				elementClose("item")

				if(this.$prefab) {
					elementOpen("item")
						elementOpen("horizontal-group")
							elementOpen("button")
								text("Apply")
							elementClose("button")

							elementOpen("button")
								text("Revert")
							elementClose("button")						
						elementClose("horizontal-group")
					elementClose("item")
				}
			elementClose("items")

			componentVoid(ComponentList, { bind: `${this.bind.value}/components` })
		elementClose("entity")
	}
})

export default Entity