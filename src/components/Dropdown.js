import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import ContextMenu from "../actions/ContextMenu"
import { firstKey } from "../Utils"

const Dropdown = component
({
	state: {
		value: null,
		default: null,
		source: null,
		valueIsId: false,
		emptyOption: false,
		sourceRoot: null
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
		let source = this.$source

		if(source) 
		{
			if(this.$sourceRoot) {
				const asset = store.get(`${this.$sourceRoot}/${source}`)
				source = asset.data
			}

			if(this.$value) {
				if(source.indexOf(this.$value) === -1) {
					this.$value = null
				}
			}

			if(!this.$value) {
				if(Array.isArray(source)) {
					this.$value = source[0]
				}
				else {
					this.$value = firstKey(source)
				}
			}
		}
		else {
			this.$value = null
		}

		elementOpen("dropdown")
			const inputNode = elementVoid("input", { 
				type: "text", 
				readonly: true,				
				onclick: this.handleClickFunc, 
				onblur: this.handleCloseFunc 
			})
			inputNode.element.value = this.$value

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

			let source = this.$source

			if(this.$sourceRoot && source) {
				const asset = store.get(`${this.$sourceRoot}/${source}`)
				source = asset.data
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
	
				for(let n = 0; n < buffer.length; n++) {
					elementOpen("item", { "data-key": buffer[n] })
						text(buffer[n])
					elementClose("item")
				}
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

	handleMenuUp(event) 
	{
		if(this.$valueIsId) {
			this.$value = event.target.dataset.key || null
		}
		else
		{
			let source = this.$source
			
			if(this.$sourceRoot && source) {
				const asset = store.get(`${this.$sourceRoot}/${source}`)
				source = asset.data
			}

			this.$value = source[event.target.dataset.key] || null
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