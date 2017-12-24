import { componentVoid, store } from "wabi"
import Menu from "../menu/Menu"
import ContextMenu from "../component/ContextMenu"

let menuX = 0
let menuY = 0
let menuProps = null
let menuBind = null
let menuVisible = false

const show = function(id, bind, event, x, y)
{
	menuProps = Menu.get(id)
	if(!menuProps) { return false }	

	menuX = (x !== undefined) ? x : event.x
	menuY = (y !== undefined) ? y : event.y
	menuBind = (typeof bind === "object") ? bind.value : bind,

	event.preventDefault()
	event.stopPropagation()

	if(!menuVisible) {
		menuVisible = true
		store.add("overlay", renderMenu)
	}
	else {
		store.set("overlay", store.data.overlay)
	}
	
	return true
}

const hide = function() {
	if(menuVisible) {
		menuVisible = false
		store.remove("overlay", renderMenu)
	}
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
