import { component, componentVoid, elementOpen, elementClose, elementVoid, text, store } from "wabi"

const Drop = component
({
	state: {
		value: null,
		name: null,
		type: null,
		exclude: null,
		dragOver: false
	},

	mount() {
		this.attr = {
			tabIndex: "-1",
			ondrop: this.handleDrop.bind(this),
			ondragover: this.handleDragOver.bind(this),
			onfocus: (event) => {
				this.$dragOver = true
			},
			onblur: (event) => {
				this.$dragOver = false
			},
			ondragexit: (event) => {
				this.$dragOver = false
			},
			ondragleave: (event) => {
				this.$dragOver = false
			},
			ondblclick: (event) => {
				store.set("local/selected", `assets/${this.$value}`)
			},			
			onkeydown: this.handleKeyDown.bind(this)
		}
		if(this.$value) {
			this.bind = {
				value: this.bind.value,
				name: `assets/${this.$value}/name`
			}
		}		
	},

	render() 
	{
		const asset = store.data.assets[this.$value]
		if(!asset) {
			this.$value = null
		}

		const attr = this.$dragOver ? Object.assign({ class: "hover" }, this.attr) : this.attr
		elementOpen("drop", attr)
			text(this.$name || "")
			elementOpen("tag")
				text(this.$type)
			elementClose("tag")
		elementClose("drop")
	},

	handleDrop(event) {
		this.$value = event.dataTransfer.types[0]
		if(this.$value) {
			this.bind = {
				value: this.bind.value,
				name: `assets/${this.$value}/name`
			}
		}		
		this.$dragOver = false
	},

	handleDragOver(event) {
		const id = event.dataTransfer.types[0]
		if(this.isDropValid(id)) {
			event.dataTransfer.dropEffect = "move"
		}
		else {
			event.dataTransfer.dropEffect = "none"
		}
		this.$dragOver = true
	},

	handleKeyDown(event) {
		event.preventDefault()
		if(event.keyCode === 46) {  // Delete 
			this.$value = null
			this.bind = {
				value: this.bind.value,
				name: null
			}
		}
	},

	isDropValid(id) 
	{
		if(id === this.$exclude) { 
			return false 
		}

		const asset = store.data.assets[id]
		if(!asset) { 
			console.warn(`(Drop.isDropValid) Asset does not exist: ${id}`)
			return false
		}

		return (asset.type === this.$type)
	}
})

export default Drop