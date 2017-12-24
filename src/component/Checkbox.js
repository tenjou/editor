import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"

const Checkbox = component
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
		elementVoid("checkbox", attr)
	},

	handleClick(event) {
		this.$value = !this.$value
	}
})

export default Checkbox
