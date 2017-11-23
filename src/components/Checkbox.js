import {
	component,
	elementOpen,
	elementClose,
	elementVoid,
} from "wabi"

export default component(
{
	state: {
		default: false
	},

	setup() {
		this.attr = { class: "checked", onclick: this.handleClick.bind(this) }
	},

	render() 
	{
		const value = (this.$value === null) ? this.$default : this.$value
		this.attr.class = value ? "checked" : ""
		elementVoid("checkbox", this.attr)
	},

	handleClick(event) {
		this.$value = !this.$value
	}
})
