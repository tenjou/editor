import {
	component,
	elementOpen,
	elementClose,
	text,
	selectElementContents
} from "wabi"

export default component(
{
	state: {
		value: null,
		editable: true,
		editing: false
	},
	mount() {
		this.attr = {
			spellcheck: false,
			onclick: this.handleClick.bind(this),
			ondblclick: this.handleDblClick.bind(this),
			onkeydown: this.handleKeyDown.bind(this),
			onblur: this.handleBlur.bind(this)

		}
	},
	render() 
	{
		let attr
		if(this.$.editing) {
			attr = Object.assign({
				contentEditable: true
			}, this.attr)
		}
		else {
			attr = Object.assign({}, this.attr)		
		}

		const node = elementOpen("word", attr)
			text(this.$.value)
		elementClose("word")

		if(this.$.editing) {
			node.element.focus()
			selectElementContents(node.element)
		}
	},
	handleClick(event) 
	{
		event.preventDefault()

		if(event.detail % 2) {}
		else {
			event.stopPropagation()
			if(this.$editable) {
				this.$editing = true
			}
		}
	},
	handleDblClick(event) {
		event.preventDefault()
		event.stopPropagation()
	},
	handleKeyDown(domEvent)
	{
		const keyCode = domEvent.keyCode

		// only 0..9, a..z, A..Z, -, _, ., space
		if((keyCode > 47 && keyCode < 58) || 
		   (keyCode > 64 && keyCode < 91) || 
		   (keyCode > 96 && keyCode < 123) || 
		   keyCode === 95 || keyCode === 189 || keyCode === 190 || keyCode === 32)
		{
			return
		}

		// Backspace || Delete
		if(keyCode === 8 || keyCode == 46) {
			return
		}
		// Arrow keys
		else if(keyCode >= 37 && keyCode <= 40) {
			return
		}
		// Esc
		else if(keyCode === 27) {
			domEvent.target.blur()
		}
		// Enter
		else if(keyCode === 13) {
			domEvent.target.blur()
		}
		else if(keyCode === 35 || keyCode === 36) {
			return
		}

		domEvent.preventDefault()
	},
	handleBlur(domEvent)
	{
		const newValue = domEvent.target.innerHTML

		if(newValue) {
			this.$value = newValue
		}

		this.$editing = false
	}
})
