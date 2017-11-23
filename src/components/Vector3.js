import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid,
	text
} from "wabi"

import NumberInput from "./NumberInput"

export default component
({
	state: {
		angle: false
	},

	mount() {
		this.attrX = { style: "background-color: rgb(208, 64, 49); text-shadow: 1px 1px #666;" }
		this.attrY = { style: "background-color: rgb(114, 181, 41); text-shadow: 1px 1px #666;" }
		this.attrZ = { style: "background-color: rgb(47, 128, 173); text-shadow: 1px 1px #666;" }
	},

	render() 
	{
		elementOpen("vector3")
			elementOpen("span", this.attrX)
				text("x")
			elementClose("span")
			componentVoid(NumberInput, { bind: `${this.bind}/0` })

			elementOpen("span", this.attrY)
				text("y")
			elementClose("span")
			componentVoid(NumberInput, { bind: `${this.bind}/1` })	

			elementOpen("span", this.attrZ)
				text("z")
			elementClose("span")
			componentVoid(NumberInput, { bind: `${this.bind}/2` })	
		elementClose("vector3")
	}
})
