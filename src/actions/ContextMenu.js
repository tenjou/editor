import { store } from "wabi"
import Menu from "../menu/Menu"

const show = (event, menuId) => 
{
	event.preventDefault()
	event.stopPropagation()

	const menu = Menu.get(menuId)
	if(!menu) {
		console.warn(`(ContextMenu.show) Could not find menu with id: ${menuId}`)
		return
	}
	store.set("contextmenu", {
		props: menu,
		x: event.clientX,
		y: event.clientY
	})
}

const hide = () => {
	store.set("contextmenu/props", null)
}

const handleClick = (event) => {
	hide()
}

const handleContextMenu = (event) => {
	event.preventDefault()
	hide()
}

store.set("contextmenu", {
	props: null,
	x: 0,
	y: 0
})

window.addEventListener("click", handleClick)
window.addEventListener("contextmenu", handleContextMenu)

export {
	show,
	hide
}