import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid,
	text
} from "wabi"

import ContextMenu from "../actions/ContextMenu"

const Inner = component(
{
	render() 
	{
		elementOpen("inner")

		const items = this.$value
		for(let n = 0; n < items.length; n++) 
		{
			const item = items[n]
			if(!item.type) {
				this.renderItem(item)
			}
			else {
				componentVoid(Category, { $value: item })
			}
		}

		elementClose("inner")
	},

	renderItem(item)
	{
		if(item.func) {
			elementOpen("item", { onclick: item.func })
		}
		else {
			elementOpen("item")
		}
			if(item.icon) {
				elementVoid("icon", { class: `fa ${item.icon}` })
			}
			else {
				elementVoid("icon")
			}
			text(item.name)
		elementClose("item")		
	}
})

const Category = component(
{
	render() 
	{
		elementOpen("category")

			elementOpen("header")
				if(this.$value.icon) {
					elementVoid("icon", { class: `fa ${this.$value.icon}` })
				}
				text(this.$value.name)
			elementClose("header")

			componentVoid(Inner, { $value: this.$value.children })

		elementClose("category")
	}
})

export default component(
{
	render() 
	{
		const menu = this.$.value
		if(!menu || !menu.props) { 
			return 
		}

		elementOpen("contextmenu", { 
			style: {
				left: menu.x + "px",
				top: menu.y + "px"
			}
		})

		componentVoid(Inner, { $value: menu.props })

		elementClose("contextmenu")
	}
})
