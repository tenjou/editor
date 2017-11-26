import { componentVoid, store } from "wabi"
import Definitions from "../definitions/Definitions"
import ContextMenu from "../components/ContextMenu"

let menuX = 0
let menuY = 0
let menuProps = null
let menuBind = null

const show = function(id, bind, event, x, y)
{
	menuProps = Definitions.get(`Context.${id}`)
	if(!menuProps) { return false }	

	menuX = (x !== undefined) ? x : event.x
	menuY = (y !== undefined) ? y : event.y
	menuBind = (typeof bind === "object") ? bind.value : bind,

	event.preventDefault()
	event.stopPropagation()

	store.add("overlay", renderMenu)
	return true
}

const hide = function() {
	store.remove("overlay", renderMenu)
}

const getBind = () => {
	return menuBind
}

const handleClick = function(event) {
	hide()
}

const handleContextMenu = function(event) {
	event.preventDefault()
	hide()
}

const renderMenu = () => {
	componentVoid(ContextMenu, { 
		$x: menuX,
		$y: menuY,
		$props: menuProps 
	})
}

window.addEventListener("click", handleClick)
window.addEventListener("contextmenu", handleContextMenu)

export default {
	show,
	hide,
	getBind
}
