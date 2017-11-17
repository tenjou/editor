import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import Word from "./Word"
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
			onclick: this.handleClick.bind(this)
		}
	},

	render() 
	{
		const item = this.$value
		const attr = this.$selected ? Object.assign({ class: "selected" }, this.attr) : this.attr

		elementOpen("item", attr)
			if(this.$open) {
				elementVoid("caret", { class: "fa fa-caret-down" })
			}
			else {
				elementVoid("caret", { class: "fa fa-caret-right" })
			}
			elementVoid("icon", { class: "fa fa-folder" })
			componentVoid(Word, { bind: `${this.bind.value}/name` })
		elementClose("item")
	},

	handleClick(event) {
		if(event.detail % 2) {
			this.$selected = true
		}
		else {
			this.$open = !this.$open
		}
	}
})

const Hierarchy = component
({
	mount() {
		this.attr = { style: "flex: 240px;" }
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
			elementClose("hierarchy")
		elementClose("panel")
	}
})

export default Hierarchy