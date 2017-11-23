import { store } from "wabi"
import Types from "../actions/Types"

let selectedData = null
let prevSelected = null
let props = null

const handleSelected = function(payload) {
	select(payload.value)
}

const select = function(key) 
{
	if(prevSelected) {
		store.unwatch(prevSelected, selectedItemWatcher)
		store.set(`${prevSelected}/cache/selected`, false)
	}

	selectedData = key ? store.get(key) : null
	if(selectedData) 
	{
		
		let type = Types.get(selectedData.type)
		if(!type) {
			type = Types.get("Default")
		}

		props = type.schema
		prevSelected = key
		store.set(`${key}/cache/selected`, true)
		store.watch(key, selectedItemWatcher)
	}
	else {
		props = null
		prevSelected = null
	}

	store.set("inspect/props", props)
}

const selectedItemWatcher = function(payload) {
	if(payload.action === "REMOVE") {
		prevSelected = null
		store.unwatch(prevSelected, selectedItemWatcher)
		store.set("local/selected", null)
	}
}

const getSelectedData = function() {
	return selectedData
}

store.set("inspect", {
	props: null
})
store.watch("local/selected", handleSelected)

export {
	getSelectedData
}