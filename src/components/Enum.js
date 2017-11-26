import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import Word from "./Word"

const EnumItem = component
({
	state: {
		value: null,
		list: null
	},

	mount() {
		this.attrButtonRemove = {
			class: "fa fa-remove",
			onclick: (event) => {
				store.remove(this.bind.value)
			}
		}
		this.attrWord = {
			bind: this.bind.value,
			$validateFunc: (newId) => {
				if(this.isValidId(newId)) {
					return newId
				}
				return this.$value
			}
		}
	},

	render() {
		elementOpen("header")
			componentVoid(Word, this.attrWord)
			elementOpen("button")
			elementVoid("icon", this.attrButtonRemove)
		elementClose("button")
		elementClose("header")
	},

	isValidId(id) {
		const index = this.$list.indexOf(id)
		if(index === -1) {
			return true
		}
		return false
	},	
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
				const list = this.$value
				for(let n = 0; n < list.length; n++) {
					componentVoid(EnumItem, { 
						bind: { value: `${this.bind}/${n}` },
						$list: list
					})
				}
			elementClose("content")
			elementOpen("button", this.attrAddButton)
				text("Add")
			elementClose("button")		
		elementClose("enum")
	},

	handleClick(event) {
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
	}	
})

export default Enum