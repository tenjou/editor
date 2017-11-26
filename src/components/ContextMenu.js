import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"

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

const ContextMenu = component
({
	state: {
		x: 0,
		y: 0,
		props: null
	},

	render() 
	{
		elementOpen("contextmenu", { 
			style: {
				left: `${this.$x}px`,
				top: `${this.$y}px`
			}
		})
			componentVoid(Inner, { $value: this.$props })
		elementClose("contextmenu")
	}
})

export default ContextMenu
