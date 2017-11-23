import {
	component,
	elementOpen,
	elementClose,
	elementVoid,
} from "wabi"

export default component(
{
	state: {
		default: "#000000"
	},

	setup() {
		this.attr = { type: "color", onchange: this.handleChange.bind(this) }
	},

	render() 
	{
		const element = elementVoid("input", this.attr)

		const value = (this.$value === null) ? this.$default : this.$value
		if(value) {
			element.value = value
		}
	},

	handleChange(event) {
		const result = event.currentTarget.value
		this.$value = result
	}
})
