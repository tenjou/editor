import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid,
	store
} from "wabi"

import FileSystem from "../fs/FileSystem"
import ContextMenu from "../actions/ContextMenu"

export default component(
{
	mount() {
		this.handleClickFunc = this.handleClick.bind(this)
		this.handleContextMenuFunc = this.handleContextMenu.bind(this)
		this.handleLoadFunc = this.handleLoad.bind(this) 
	},
	render() 
	{
		this.iframe = elementVoid("iframe", { 
			src: this.$value,
			onload: this.handleLoadFunc
		}).element
	},
	handleLoad(event) 
	{
		const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document
		iframeDoc.onclick = this.handleClickFunc
		iframeDoc.oncontextmenu = this.handleContextMenuFunc

		this.iframe.contentWindow.modules[0](store, FileSystem.fullPath)
		this.iframe.focus()
	},
	handleClick(event) {
		ContextMenu.hide()
	},
	handleContextMenu(event) {
		event.preventDefault()
		event.stopPropagation()
		ContextMenu.hide()
	},

	iframe: null
})
