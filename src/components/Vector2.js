import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid
} from "wabi"

import NumberInput from "./NumberInput"

export default component(
{
	setup() {
		this.attrX = { $value: "x", style: "background-color: #cc0c0c;" }
		this.attrY = { $value: "y", style: "background-color: #cc0c0c;" }
	},

	render() {
		elementOpen("vector2")
			elementOpen("row")
				elementVoid("span", this.attrX)
				componentVoid(NumberInput, { bind: `${this.bind}.0` })
			elementClose("row")
			
			elementOpen("row")
				elementVoid("span", this.attrY)
				componentVoid(NumberInput, { bind: `${this.bind}.1` })
			elementClose("row")
		elementClose("vector2")
	}
})
