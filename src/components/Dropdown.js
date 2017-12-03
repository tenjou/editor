import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import ContextMenu from "../actions/ContextMenu"

const Dropdown = component
({
	state: {
		value: null,
		default: null,
		source: null,
		source2: null,
		valueIsId: false,
		emptyOption: false
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

		if(!this.$value) {
			this.$value = (this.$valueIsId) ? 0 : this.$source[0]
		}
	},

	render()
	{
		elementOpen("dropdown")
			const value = (this.$value === null) ? this.$default : this.$value

			let item 
			if(this.$valueIsId) {
				item = this.$source ? this.$source[value] : null
				if(!item && this.$source2) {
					item = this.$source2 ? this.$source2[value] : null
				}
			}
			else {
				item = value
			}
			
			let name
			if(item) 
			{
				if(typeof item === "string") {
					name = item
				}
				else {
					name = item.name
				}
			}
			else {
				name = ""
			}

			const inputNode = elementVoid("input", { 
				type: "text", 
				readonly: true,				
				onclick: this.handleClickFunc, 
				onblur: this.handleCloseFunc 
			})
			inputNode.element.value = name

			elementVoid("icon", { class: "fa fa-caret-down" })
		elementClose("dropdown")	
	},

	renderMenu()
	{
		const menuAttr = Object.assign({
			style: {
				left: `${this.menuX}px`,
				top: `${this.menuY}px`,
				width: `${this.menuWidth}px`
			}
		}, this.menuAttr)

		elementOpen("menu", menuAttr)
			if(this.$emptyOption) {
				elementVoid("item")
			}
			this.renderSource(this.$source)
			this.renderSource(this.$source2, true)
		elementClose("menu")
	},

	renderSource(source, line) 
	{
		if(!source) { return }

		if(line) {
			elementVoid("line")
		}

		if(Array.isArray(source)) 
		{
			// source.sort((a, b) => {
			// 	return a.localeCompare(b)
			// })

			for(let n = 0; n < source.length; n++) {
				elementOpen("item", { "data-key": n })
					text(source[n])
				elementClose("item")
			}
		}
		else
		{
			const buffer = []
			for(let key in source) {
				buffer.push(key)
			}

			// buffer.sort((a, b) => {
			// 	return source[a].name.localeCompare(source[b].name)
			// })

			for(let n = 0; n < buffer.length; n++) 
			{
				for(let n = 0; n < source.length; n++) {
					elementOpen("item", { "data-key": buffer[n] })
						text(source[key])
					elementClose("item")
				}
			}
		}	
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

	handleMenuUp(event) 
	{
		if(this.$valueIsId) {
			this.$value = event.target.dataset.key || null
		}
		else {
			this.$value = this.$source[event.target.dataset.key] || null
		}
		
		this.menuOpen = false
		store.remove("overlay", this.renderMenuFunc)
	},

	close(event) {
		this.menuOpen = false
		store.remove("overlay", this.renderMenuFunc)
	}
})

export default Dropdown