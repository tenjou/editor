import { update, store } from "wabi"
import Definitions from "../definitions/Definitions"

const show = function(id, bind, event)
{
	event.preventDefault()
	event.stopPropagation()

	const props = Definitions.get(`Context.${id}`)
	if(!props) {
		return false
	}	

	store.set("contextmenu", {
		props,
		bind: (typeof bind === "object") ? bind.value : bind,
		x: event.x,
		y: event.y
	})

	return true
}

const hide = function() {
	// if(store.data.contextmenu.props) {
		store.set("contextmenu/props", null)
	// }
}

const handleClick = function(event) {
	hide()
}

const handleContextMenu = function(event) {
	event.preventDefault()
	hide()
}

store.set("contextmenu", {})
window.addEventListener("click", handleClick)
window.addEventListener("contextmenu", handleContextMenu)

const context = 
{
	set props(value) 
	{
		if(context._props === value) { return }
		context._props = value
		update()
	},

	get props() {
		return context._props
	},

	set path(path) {
		this._path = path
	},

	get path() {
		return this._path
	},

	_path: null,

	show,
	hide,

	x: 0,
	y: 0,
	_props: null
}

export default context
