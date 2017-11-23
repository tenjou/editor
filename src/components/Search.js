import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid
} from "wabi"

export default component({
	mount() {
		this.attrIcon = { class: "fa fa-search" }
		this.attrInput = { 
			type: "text", 
			onkeydown: this.handleKeyDown.bind(this),
			onchange: this.handleChange.bind(this) 
		}
	},

	render() {
		elementOpen("search")
			elementVoid("icon", this.attrIcon)
			const input = elementVoid("input", this.attrInput).element
			input.value = this.$value
		elementClose("search")
	},

	handleChange(event) {
		this.$value = event.currentTarget.value
	},

	handleKeyDown(event) {
		const keyCode = event.keyCode
		switch(keyCode) {
			case 27: // ESC 
				this.$value = ""
				break
		}
	}
})
