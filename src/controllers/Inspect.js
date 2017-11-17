import { store } from "wabi"

let selected = null
let selectedData = null

const select = (id) => {
	if(selected) {
		store.set(`assets/${selected}/cache/selected`, false)
	}
	selected = id
	if(selected) {
		selectedData = store.get(selected)
	}
}

const unselect = (id) => {
	if(selected === id) {
		selected = null
		selectedData = null
	}
}

export {
	select,
	unselect
}