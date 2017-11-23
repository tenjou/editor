import { store } from "wabi"

const NORMAL = 0
const WARN = 1
const ERROR = 2

let loadingDependencies = 0

store.set("status", {
	loading: false,
	log: []
})

const log = function(text, level) {
	store.add("status/log", { 
		text, 
		level: level || 0 
	})
}

const startLoading = function() 
{
	if(loadingDependencies === 0) {
		store.set("status/loading", true)
	}

	loadingDependencies++
}

const endLoading = function()
{
	loadingDependencies--

	if(loadingDependencies === 0) {
		store.set("status/loading", false)
	}
}

const clear = () => {
	store.set("status/log", [])
}

export { 
	log, 
	startLoading,
	endLoading,
	clear,
	NORMAL, WARN, ERROR
}