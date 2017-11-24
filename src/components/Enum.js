import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import Word from "./Word"

const EnumItem = component
({
	mount() {
		this.attrButtonRemove = {
			class: "fa fa-remove",
			onclick: (event) => {
				store.remove(this.bind)
			}
		}
		this.attrWord = {
			bind: this.bind,
			$validateFunc(newName) {
				return newName
			}
		}
	},

	render() {
		elementOpen("item")
			elementOpen("button")
				elementVoid("icon", this.attrButtonRemove)
			elementClose("button")
			componentVoid(Word, this.attrWord)
		elementClose("item")
	}
})

const Enum = component
({
	mount() {
		this.attrAddButton = {
			onclick: this.handleClick.bind(this)
		}
	},

	render() 
	{	
		elementOpen("enum")
			elementOpen("content", { class: "column" })
				const items = this.$value
				for(let n = 0; n < items.length; n++) {
					console.log("item")
					componentVoid(EnumItem, { bind: `${this.bind}/${n}` })
				}
			elementClose("content")
			elementOpen("button", this.attrAddButton)
				text("Add")
			elementClose("button")		
		elementClose("enum")
	},

	addItem() 
	{
		const items = this.$value
		let name = "Item"
		let id = 1
		for(;;) {
			const index = items.indexOf(name)
			if(index === -1) { break }

			id++
			name = `Item ${id}`
		}
		store.add(this.bind, name)
	},

	handleClick(event) {
		this.addItem()
	}	
})

export default Enum