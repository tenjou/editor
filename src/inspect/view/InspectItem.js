import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import Caret from "./Caret"
import List from "./List"
import NumberInput from "~/component/NumberInput"

const InspectItem = component
({
	state: {
		value: null,
		type: null
	},

	render() {
		elementOpen("item")
			switch(this.$type) {
				case "List":
					elementOpen("name")
						text("list")
					elementClose("name")

					elementOpen("items")
						elementOpen("item")
							elementOpen("name")
								text("size")
							elementClose("name")
							componentVoid(NumberInput)
						elementClose("item")

						for(let n = 0; n < 4; n++) {
							elementOpen("item")
								elementOpen("name")
									text(`Element ${n}`)
								elementClose("name")
								componentVoid(NumberInput)
							elementClose("item")							
						}
					elementClose("items")
					break
			}
		elementClose("item")
	}
})

export default InspectItem