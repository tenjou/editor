import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"

const Caret = component
({
	mount() {
		this.attrOpen = {
			class: "fa fa-caret-down",
			onclick: (event) => {
				this.$value = false
			}
		}
		this.attrClose = {
			class: "fa fa-caret-right",
			onclick: (event) => {
				this.$value = true
			}
		}
	},

	render() {
		if(this.$value) {
			elementVoid("caret", this.attrOpen)
		}
		else {
			elementVoid("caret", this.attrClose)
		}
	}
})

export default Caret