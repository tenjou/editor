import { store } from "wabi"

const hide = () => {
	store.set("contextmenu/show", false)
}

const handleClick = (event) => {
	hide()
}

const handleContextMenu = (event) => {
	event.preventDefault()
	hide()
}

store.set("contextmenu", {
	show: false,
	x: 0,
	y: 0
})

window.addEventListener("click", handleClick)
window.addEventListener("contextmenu", handleContextMenu)
