import {
	component,
	elementVoid,
	elementOpen,
	elementClose
} from "wabi"

export default component
({
	state: {
		value: 0,
		min: Number.MIN_SAFE_INTEGER,
		max: Number.MAX_SAFE_INTEGER,
		step: "any"
	},

	mount() 
	{
		this.attr = { 
			type: "number", 
			min: Number.MIN_SAFE_INTEGER, 
			max: Number.MAX_SAFE_INTEGER, 
			step: null,
			onchange: this.handleOnChange.bind(this)
		}
	},

	render()
	{
		const attr = Object.assign({
			min: this.$.min,
			max: this.$.max,
			step: this.$.step
		}, this.attr)

		elementOpen("number")
			const element = elementVoid("input", attr).element
			element.value = this.$.value
		elementClose("number")
	},

	handleOnChange(event) 
	{
		let value = parseFloat(event.currentTarget.value)
		if(isNaN(value)) {
			value = 0
			event.currentTarget.value = value
		}
		
		if(value < this.$min) {
			value = this.$min
			event.currentTarget.value = value
		}
		else if(value > this.$max) {
			value = this.$max
			event.currentTarget.value = value
		}

		if(value !== this.$value) {
			this.$value = value
		}
	}
})

