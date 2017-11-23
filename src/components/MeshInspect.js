import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid
} from "wabi"

const Item = component(
{
	state: {
		bind: ""
	},

	render() {
		elementOpen("item")
			elementVoid("name", { $value: this.$value.name })
		elementClose("item")
	}
})

export default component(
{
	state: {
		selected: null
	},

	setup() {
		this.attr = { onclick: this.handleClick.bind(this) }
		this.itemAttr = { onclick: this.handleClick.bind(this) }	
	},

	render()
	{
		elementOpen("mesh-inspect", this.attr)
		this.renderItems()
		elementClose("mesh-inspect")
	},

	renderItems()
	{
		const items = this.$value.children
		if(!items) { return }

		const local = this.$value.local

		for(let key in items) 
		{
			this.itemAttr.$value = items[key]
			this.itemAttr.$bind = `${this.bind.value}.children.${key}`	

			if(this.$selected === this.itemAttr.$bind) {
				this.itemAttr.class = "selected"
				
			}
			else 
			{
				if(!this.$selected) {
					this.$selected = this.itemAttr.$bind
					this.itemAttr.class = "selected"
				}
				else {
					this.itemAttr.class = ""
				}
			}

			componentVoid(Item, this.itemAttr)
		}
	},

	handleClick(event) {
		this.$selected = event.target.metaData.$bind
	}
})
