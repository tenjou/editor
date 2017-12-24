import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import NumberInput from "~/component/NumberInput"

const List = component
({
	render() {
		elementOpen("list")
			elementOpen("item")
				elementOpen("name")
					text("size")
				elementClose("name")
				componentVoid(NumberInput)
			elementClose("item")
		elementClose("list")
	}
})

export default List