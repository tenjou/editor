import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import Word from "./Word"
import ContextMenu from "../actions/ContextMenu"
import { isEmpty } from "../Utils" 

const HierarchyItem = component
({
	state: {
		value: null,
		open: false,
		selected: false
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
			componentVoid(HierarchyItems, { bind: `${this.bind.value}/children` })
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
	}
})

const HierarchyItems = component
({
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
	}
})

const Hierarchy = component
({
	mount() {
		this.attr = { 
			style: "flex: 240px;",
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
					componentVoid(HierarchyItems, { bind: this.bind })
				}
			elementClose("hierarchy")
		elementClose("panel")
	}
})

export default Hierarchy