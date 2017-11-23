import {
	component,
	elementVoid
} from "wabi"

export default component({
	state: {
		value: "",
		readonly: false
	},
	mount() 
	{
		this.attr = { 
			type: "text", 
			spellcheck: false, 
			onchange: this.handleChange.bind(this),
			tabIndex: -1
		}
	},
	render() 
	{
		const attr = this.$.readonly ? Object.assign({ readonly: true }, this.attr) : this.attr
		const node = elementVoid("input", attr)
		node.element.value = this.$value
	},
	handleChange(event) {
		this.$value = event.target.value
	}
})
