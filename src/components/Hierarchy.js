import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid,
	store,
	text
} from "wabi"

import ContextMenu from "../actions/ContextMenu"
import Hierarchy from "../actions/Hierarchy"
import Types from "../actions/Types"
import Word from "./Word"
import { isEmpty } from "../Utils"

const Item = component
({
	state: {
		value: null,
		open: true,
		selected: false
	},

	mount()
	{
		this.attr = {
			onclick: this.handleClick.bind(this),
			oncontextmenu: this.handleContextMenu.bind(this)
		}
		this.attrSelected = Object.assign({
			class: "select"
		}, this.attr)

		this.caretStatics = {
			onclick: this.handleCaretClick.bind(this)
		}
	},

	render()
	{
		const attr = this.$.selected ? this.attrSelected : this.attr
		const item = this.$.value

		const element = elementOpen("item", attr)
			this.renderCaret()

			const icon = Types.getIconFromType(item.type)
			elementVoid("icon", { class: `fa ${icon}` })

			componentVoid(Word, { bind: `${this.bind.value}/name` })
		elementClose("item")
	},

	renderCaret()
	{
		const children = this.$.value.children
		if(children && !isEmpty(children))
		{
			if(this.$open) {
				elementVoid("caret", { class: "fa fa-caret-down" }, null, this.caretStatics)
			}
			else {
				elementVoid("caret", { class: "fa fa-caret-right" }, null, this.caretStatics)
			}
		}
	},

	handleCaretClick(event)
	{
		event.stopPropagation()

		this.$open = !this.$open
	},

	handleClick(event)
	{
		event.stopPropagation()

		if(event.detail % 2) {
			store.set("local/selected", this.bind.value)
		}
		else {
			this.handleCaretClick(event)
		}
	},

	handleContextMenu(event)
	{
		store.set("local/selected", this.bind.value)

		const type = this.$.value.type
		if(type)
		{
			if(!ContextMenu.show(`Hierarchy.${type}`, this.bind.value, event)) {
				ContextMenu.show("Hierarchy.Item", this.bind.value, event)
			}
		}
		else {
			ContextMenu.show("Hierarchy.Item", this.bind.value, event)
		}
	}
})

const Browser = component
({
	state: {
		scene: null,
		children: null
	},

	render()
	{
		elementOpen("browser")

		const items = this.$.children
		const bindPath = `${this.bind.scene}/items/`
		for(let key in items) {
			const item = items[key]
			const itemBindPath = `${bindPath}${key}`
			const itemComp = componentVoid(Item, {
				bind: {
					value: itemBindPath,
					selected: `${itemBindPath}/cache/selected`,
					open: `${itemBindPath}/cache/open`
				}
			})
		}

		elementClose("browser")
	}
})

export default component
({
	state: {
		scene: null,
		children: null
	},

	mount()
	{
		this.attr = {
			class: "embeded-panel",
			tabIndex: 1,
			oncontextmenu: this.handleContextMenu.bind(this),
			onfocus: this.handleFocus.bind(this),
			onblur: this.handleBlur.bind(this)
		}
		this.attrIcon = {
			class: "pointer fa fa-plus",
			onclick: this.handleContextMenu.bind(this)
		}
		this.attrContent = { class: "centered" }
	},

	render()
	{
		elementOpen("hierarchy", this.attr)
			elementOpen("header")
				text("Hierarchy")
			elementClose("header")

			elementVoid("icon", this.attrIcon)

			const items = this.$.children
			if(!items || isEmpty(items)) {
				elementOpen("content", this.attrContent)
					text("No objects have been added")
				elementClose("content")
			}
			else {
				componentVoid(Browser, { 
					bind: this.bind
				})
			}
		elementClose("hierarchy")
	},

	handleContextMenu(event) {
		ContextMenu.show("Hierarchy.Scene", this.bind, event)
	},

	handleFocus(event) {
		window.addEventListener("keydown", handleKeyDown)
	},

	handleBlur(event) {
		window.removeEventListener("keydown", handleKeyDown)
	}
})

const handleKeyDown = (event) => {
	switch(event.keyCode)
	{
		case 46: // DELETE
		{
			const selected = store.get("local/selected")
			if(selected) {
				Hierarchy.remove(selected)
			}
		} break
	}
}
