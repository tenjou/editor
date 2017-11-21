import { store } from "wabi"
import { uuid4 } from "../Utils"

const fetch = () => {
	store.set("projects/loading", true)

	store.set("projects/loading", false)
}

const create = () => {
	const timestamp = Date.now()
	const data = {
		id: uuid4(),
		created: timestamp,
		updated: timestamp,
		version: 1
	}
}

store.set("projects", {
	list: [],
	loading: false
})

export {
	fetch,
	create
}