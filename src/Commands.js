import { store } from "wabi"

class AddItem 
{
	constructor(data) {
		this.data = data
	}

	execute() {
		store.add(`hierarchy`, this.data)
	}

	undo() {
		store.remove(`hierarchy`, this.data)
	}
}

class RemoveItem 
{
	constructor(data) {
		this.data = data
	}

	execute() {
		store.remove(`hierarchy`, this.data)
	}

	undo() {
		store.add(`hierarchy`, this.data)
	}
}

export {
	AddItem,
	RemoveItem
}