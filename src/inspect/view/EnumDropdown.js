import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"

const EnumDropdown = component
({
	state: {
		value: null,
		source: null
	},

	mount() 
	{
		this.menuOpen = false
		this.menuX = 0
		this.menuY = 0
		this.menuWidth = 0
		this.menuAttr = {
			onmousedown: this.handleMenuDown.bind(this),
			onmouseup: this.handleMenuUp.bind(this)			
		}

		this.handleClickFunc = this.handleClick.bind(this)
		this.handleCloseFunc = this.close.bind(this)
		this.renderMenuFunc = this.renderMenu.bind(this)		
	},

	render() 
	{
		elementOpen("dropdown")
			const inputNode = elementVoid("input", { 
				type: "text", 
				readonly: true,				
				onclick: this.handleClickFunc, 
				onblur: this.handleCloseFunc 
			})
			inputNode.element.value = this.$value ? store.data.assets[this.$value].name : ""
			elementVoid("icon", { class: "fa fa-caret-down" })
		elementClose("dropdown")
	},

	renderMenu()
	{
		const items = this.$source
		const menuAttr = Object.assign({
			style: {
				left: `${this.menuX}px`,
				top: `${this.menuY}px`,
				width: `${this.menuWidth}px`
			}
		}, this.menuAttr)

		elementOpen("menu", menuAttr)
			for(let key in items) {
				elementOpen("item", { "data-key": items[key] })
					text(key)
				elementClose("item")
			}
		elementClose("menu")
	},

	handleClick(event) 
	{
		const rect = event.currentTarget.getBoundingClientRect()
		this.menuX = rect.left
		this.menuY = rect.bottom
		this.menuWidth = rect.width

		if(this.menuOpen) {
			this.menuOpen = false
			store.remove("overlay", this.renderMenuFunc)
		}
		else {
			this.menuOpen = true
			store.add("overlay", this.renderMenuFunc)
		}
	},

	handleMenuDown(event) {
		event.preventDefault()
		event.stopPropagation()
	},

	handleMenuUp(event) {
		this.$value = event.target.dataset.key || null
		this.menuOpen = false
		store.remove("overlay", this.renderMenuFunc)
	},

	close(event) {
		this.menuOpen = false
		store.remove("overlay", this.renderMenuFunc)
	}	
})

export default EnumDropdown