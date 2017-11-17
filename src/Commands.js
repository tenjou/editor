import { store } from "wabi"

class AddItem 
{
	constructor(data) {
		this.data = data
	}

	execute() {
		store.set(`assets/${this.data.id}`, this.data)
		store.add(`hierarchy`, this.data.id)
	}

	undo() {
		store.remove(`assets/${this.data.id}`)
		store.remove(`hierarchy`, this.data.id)
	}
}

class RemoveItem 
{
	constructor(data) {
		this.data = data
	}

	execute() {
		store.remove(`assets/${this.data.id}`)
		store.remove(`hierarchy`, this.data.id)
	}

	undo() {
		store.set(`assets/${this.data.id}`, this.data)
		store.add(`hierarchy`, this.data.id)
	}
}

export {
	AddItem,
	RemoveItem
}