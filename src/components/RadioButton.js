import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"

const RadioButton = component
({
	state: {
		value: false
	},

	mount() {
		this.attr = {
			onclick: this.handleClick.bind(this) 
		}
	},

	render() {
		const attr = this.$value ? Object.assign({ class: "checked" }, this.attr) : this.attr
		elementVoid("radiobutton", attr)
	},

	handleClick(event) {
		this.$value = !this.$value
	}
})

export default RadioButton