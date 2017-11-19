import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import Word from "./Word"
import ContextMenu from "../actions/ContextMenu"
import { isEmpty } from "../Utils" 

const HierarchyItem = component
({
	state: {
		value: null,
		open: false,
		selected: false,
		dragOver: false
	},

	mount() {
		this.attr = {
			onclick: this.handleClick.bind(this),
			oncontextmenu: this.handleContextMenu.bind(this)
		}
	},

	render() 
	{
		const item = this.$value
		const open = this.$open
		const attr = this.$selected ? Object.assign({ class: "selected" }, this.attr) : this.attr
	
		elementOpen("item", attr)
			if(item.children)
			{
				if(open) {
					elementVoid("caret", { class: "fa fa-caret-down" })
				}
				else {
					elementVoid("caret", { class: "fa fa-caret-right" })
				}
			}
			elementVoid("icon", { class: "fa fa-folder" })
			componentVoid(Word, { bind: `${this.bind.value}/name` })
		elementClose("item")

		if(item.children && open) {
			componentVoid(HierarchyItems, { 
				bind: {
					value: `${this.bind.value}/children` 
				}
			})
		}
	},

	handleClick(event) {
		if(event.detail % 2) {
			this.$selected = true
		}
		else {
			this.$open = !this.$open
		}
	},

	handleContextMenu(event) {
		this.$selected = true
		ContextMenu.show(event, "HierarchyItem")
	},

	handleDrop(event) 
	{
		event.stopPropagation()
		event.preventDefault()
		this.$dragOver = false

		const parentAsset = store.get(store.get("local/assets/location"))
		Assets.dropFiles(event.dataTransfer.items, parentAsset.id)
	},

	handleDragOver(event) {
		event.stopPropagation()
		event.preventDefault()
		event.dataTransfer.dropEffect = "copy"
	},

	handleDragEnter(event) {
		event.stopPropagation()
		event.preventDefault()
		this.$dragOver = true
	},

	handleDragLeave(event) {
		event.stopPropagation()
		event.preventDefault()
		this.$dragOver = false
	}	
})

const HierarchyItems = component
({
	state: {
		value: null,
		dragOver: false
	},

	mount() {
		this.attr = {
			ondrop: this.handleDrop.bind(this),
			ondragover: this.handleDragOver.bind(this),
			ondragenter: this.handleDragEnter.bind(this),
			ondragleave: this.handleDragLeave.bind(this),
			oncontextmenu: this.handleContextMenu.bind(this)			
		}		
	},

	render() {
		const items = this.$value
		elementOpen("content")
			for(let n = 0; n < items.length; n++) {
				const itemId = items[n]
				const itemPath = `assets/${itemId}`
				componentVoid(HierarchyItem, { 
					bind: {
						value: itemPath,
						open: `${itemPath}/cache/open`,
						selected: `${itemPath}/cache/selected`,
					}
				})
			}
		elementClose("content")
	},

	handleDrop(event) 
	{
		event.stopPropagation()
		event.preventDefault()
		this.$dragOver = false

		console.log(event.dataTransfer.items)		
		// const parentAsset = store.get(store.get("local/assets/location"))
		// Assets.dropFiles(event.dataTransfer.items, parentAsset.id)
	},

	handleDragOver(event) {
		event.stopPropagation()
		event.preventDefault()
		event.dataTransfer.dropEffect = "copy"
	},

	handleDragEnter(event) {
		event.stopPropagation()
		event.preventDefault()
		this.$dragOver = true
	},

	handleDragLeave(event) {
		event.stopPropagation()
		event.preventDefault()
		this.$dragOver = false
	},

	handleContextMenu(event) {
		this.$selected = true
		ContextMenu.show(event, "HierarchyItem")
	}	
})

const Hierarchy = component
({
	mount() {
		this.attr = { 
			style: "flex: 0 0 220px;",
			oncontextmenu(event) {
				ContextMenu.show(event, "Hierarchy")
			}			
		}
	},

	render() 
	{
		const items = this.$value

		elementOpen("panel", this.attr)
			elementOpen("hierarchy")			
				elementOpen("header")
					text("Hierarchy")
				elementClose("header")

				if(isEmpty(items)) {
					elementOpen("content", { class: "centered" })
						text("No content is added")
					elementClose("content")
				}
				else {
					componentVoid(HierarchyItems, { 
						bind: {
							value: this.bind 
						}
					})
				}
			elementClose("hierarchy")
		elementClose("panel")
	}
})

export default Hierarchy