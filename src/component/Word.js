import { component, componentVoid, elementOpen, elementClose, elementVoid, text, selectElementContents } from "wabi"

const Word = component
({
	state: {
		value: null,
		editable: true,
		editing: false,
		validateFunc: null
	},

	mount() {
		this.attr = {
			class: "invisible-scrollbar",
			spellcheck: false,
			onclick: this.handleClick.bind(this),
			ondblclick: this.handleDblClick.bind(this),
			onkeydown: this.handleKeyDown.bind(this),
			onblur: this.handleBlur.bind(this)
		}
		this.word = null
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
			attr = Object.assign({
				style: { textOverflow: "ellipsis" }
			}, this.attr)		
		}

		this.word = elementOpen("word", attr).element
			text(this.$.value)
		elementClose("word")

		if(this.$.editing) {
			this.word.focus()
			selectElementContents(this.word)
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
			if(this.$validateFunc) {
				this.$value = this.$validateFunc(newValue)
			}
			else {
				this.$value = newValue
			}
		}

		this.word.scrollLeft = 0
		this.$editing = false

		const selection = window.getSelection()
		selection.removeAllRanges()
	}
})

export default Word