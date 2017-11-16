import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import "../actions/ContextMenu"
import HierarchyMenu from "../menu/HierarchyMenu"

const ContextMenuInner = component({
	render() {
		elementOpen("inner")
			const items = this.$value
			for(let n = 0; n < items.length; n++) {
				const item = items[n]
				if(item.type === "category") {
					this.renderCategory(item)
				}
				else if(item.type === "menu") {
					this.renderMenu(item)
				}
				else {
					this.renderItem(item)
				}
			}
		elementClose("inner")
	},

	renderItem(item) {
		const attr = item.func ? { onclick: item.func } : null
		elementOpen("item", attr)
			if(item.icon) {
				elementVoid("icon", { class: `fa ${item.icon}` })
			}
			text(item.name)
		elementClose("item")
	},

	renderCategory(item) {
		elementOpen("category")
			elementOpen("header")
				text(item.name)
			elementClose("header")
			componentVoid(ContextMenuInner, { $value: item.children })
		elementClose("category")
	},

	renderMenu(item) {
		elementOpen("item")
			text(item.name)
			elementVoid("caret", { class: "fa fa-caret-right"})
			elementOpen("contextmenu")
				componentVoid(ContextMenuInner, { $value: item.children })
			elementClose("contextmenu")
		elementClose("item")
	}
})

const ContextMenu = component({
	mount() {
		this.bind = "contextmenu"
	},

	render() {
		if(!this.$value.show) { return }
		elementOpen("contextmenu", { 
			style: {
				left: `${this.$value.x}px`,
				top: `${this.$value.y}px`
			}
		})
			componentVoid(ContextMenuInner, { $value: HierarchyMenu })
		elementClose("contextmenu")
	}
})

export default ContextMenu