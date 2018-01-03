import {
	store,
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid,
	text
} from "wabi"

import Directories from "./Directories"
import Word from "../Word"
import Search from "../Search"
import Assets from "../../actions/Assets"
import Types from "../../actions/Types"
import ContextMenu from "../../actions/ContextMenu"
import FileSystem from "~/fs/FileSystem"
import { isEmpty } from "~/Utils"

const attrCenteredContent = { class: "column centered max"}
const attrArrowIcon = { class: "fa fa-caret-right" }

const LocationSegment = component
({
	state: {
		value: null,
		name: null
	},

	mount() 
	{
		this.attr = {
			onclick: (event) => {
				store.set("local/assets/location", this.$.value.id)
			}
		}
	},

	render() 
	{
		const parentId = this.$.value.parent

		elementOpen("segment")
			if(parentId !== null) {
				const parent = store.data.assets[parentId]
				componentVoid(LocationSegment, { 
					bind: {
						value: `assets/${parent.id}`,
						name: `assets/${parent.id}/name`
					}
				})
			}
			elementOpen("item", this.attr)
				if(this.$.name) {
					text(this.$.name)
				}
				else {
					text("Assets")
				}
				elementVoid("icon", attrArrowIcon)
			elementClose("item")
		elementClose("segment")
	}
})

const FilesLocation = component({
	render() 
	{
		elementOpen("location")
			const location = this.$.value
			const asset = store.get(`assets/${location}`)

			elementOpen("item")
				componentVoid(LocationSegment, { 
					bind: {
						value: `assets/${asset.id}`,
						name: `assets/${asset.id}/name`
					}
				})
			elementClose("item")
		elementClose("location")
	}
})

const FilesItem = component({
	state: {
		value: null,
		selected: false,
		dragOver: false
	},
	mount() {
		this.numDragEnters = 0
		this.word = null
		this.attr = {
			draggable: "true",
			tabindex: 0,
			"data-id": "",
			onclick: this.handleClick.bind(this),
			ondblclick: this.handleDblClick.bind(this),
			ondragstart: this.handleDragStart.bind(this),
			ondrop: this.handleDrop.bind(this),
			ondragover: this.handleDragOver.bind(this),
			ondragenter: this.handleDragEnter.bind(this),
			ondragleave: this.handleDragLeave.bind(this),
			oncontextmenu: this.handleContextMenu.bind(this),
			onkeyup: this.handleKeyUp.bind(this)
		}
	},

	render() 
	{
		const asset = this.$.value

		let cls = ""
		if(this.$.selected) { cls += "select" }
		if(this.$.dragOver) { cls += " upload" }

		const attr = Object.assign({ class: cls }, this.attr)
		attr["data-id"] = asset.id

		elementOpen("item", attr)
			if(asset.type === "Texture") {
				elementOpen("image")
					const path = Assets.buildPath(asset)
					elementVoid("img", { src: `${FileSystem.fullPath}${path}?${asset.updated}` })
				elementClose("image")
			}
			else {
				const icon = Types.getIconFromType(asset.type)
				elementVoid("icon", { class: `fa ${icon}` })
			}
			this.word = componentVoid(Word, { bind: `${this.bind.value}/name` })
		elementClose("item")
	},

	handleClick(event) {
		store.set("local/selected", this.bind.value)
	},

	handleDblClick(event) {
		Assets.openSelected()
	},

	handleDragStart(event) {
		event.dataTransfer.setData(event.target.dataset.id, "")
		event.dataTransfer.effectAllowed = "move"
		const img = new Image()
		event.dataTransfer.setDragImage(img, 0, 0)
	},

	handleDrop(event) 
	{
		event.stopPropagation()
		event.preventDefault()
		this.$dragOver = false
		this.numDragEnters = 0

		const data = event.dataTransfer.types[0]
		if(this.isDropValid(data)) {
			if(data === "Files") {
				Assets.dropFiles(event.dataTransfer.items, this.$.value.id)
			}
			else {
				Assets.move(event.currentTarget.dataset.id, data)
			}
		}
	},
	handleDragOver(event) 
	{
		event.stopPropagation()
		event.preventDefault()

		const data = event.dataTransfer.types[0]
		if(this.isDropValid(data)) {
			event.dataTransfer.dropEffect = "move"
		}
		else {
			event.dataTransfer.dropEffect = "none"
		}
	},
	handleDragEnter(event) 
	{
		event.stopPropagation()
		event.preventDefault()

		if(this.numDragEnters === 0) {
			this.$dragOver = true
		}
		this.numDragEnters++
	},
	handleDragLeave(event) 
	{
		event.stopPropagation()
		event.preventDefault()

		this.numDragEnters--
		if(this.numDragEnters === 0) {
			this.$dragOver = false
		}
	},
	handleContextMenu(event) {
		store.set("local/selected", this.bind.value)
		if(!ContextMenu.show(`assets.${this.$value.type}`, this.bind, event)) {
			ContextMenu.show("assets.item", this.bind, event)
		}		
	},
	handleKeyUp(event) 
	{
		// F2 
		if(event.keyCode === 113) { 
			if(this.word) {
				this.word.$editing = true
			}
		}
	},
	isDropValid(itemId) 
	{
		const assets = store.data.assets
		const parent = assets[this.$.value.id]
		const item = assets[itemId]
		const parentPath = Assets.buildPath(parent)
		const itemPath = Assets.buildPath(item)

		if(parentPath === itemPath) {
			return false
		}
		if(parent.type !== "Folder") {
			return false
		}

		return true
	}
})

const FilesItems = component({
	state: {
		items: null,
		search: null,
		dragOver: false
	},
	mount() {
		this.attr = {
			ondrop: this.handleDrop.bind(this),
			ondragover: this.handleDragOver.bind(this),
			ondragenter: this.handleDragEnter.bind(this),
			ondragleave: this.handleDragLeave.bind(this),
			oncontextmenu: this.handleContextMenu.bind(this)			
		}
	},
	render() {
		const attr = this.$.dragOver ? Object.assign({ class: "upload" }, this.attr) : this.attr
		elementOpen("items", attr)

		let itemsListed = 0
		const items = this.$.items
		if(items)
		{
			const search = this.$.search
			const sortedKeys = Object.values(items).sort((a, b) => {
				if(a.type === "Folder")
				{
					if(b.type === "Folder") {
						return a.name.localeCompare(b.name, "en", { numeric: true })
					}
					else {
						return -1
					}
				}
				else if(b.type === "Folder") {
					return 1
				}

				return a.name.localeCompare(b.name, "en", { numeric: true })
			})
			
			if(search)
			{
				for(let n = 0; n < sortedKeys.length; n++)
				{
					const data = sortedKeys[n]
					if(data.name.indexOf(search) !== -1) {
						this.renderItem(data)
						itemsListed++
					}
				}
			}
			else
			{
				for(let n = 0; n < sortedKeys.length; n++)
				{
					const data = sortedKeys[n]
					this.renderItem(data)
					itemsListed++
				}
			}
		}

		if(itemsListed === 0) {
			elementOpen("content", attrCenteredContent)
				text("This folder is empty")
			elementClose("content")
		}

		elementClose("items")
	},

	renderItem(item) 
	{
		const path = `assets/${item.id}`
		const attr = { 
			bind: {
				value: path,
				selected: `${path}/cache/selected`
			}
		}

		componentVoid(FilesItem, attr)		
	},

	handleContextMenu(event) {
		ContextMenu.show("assets", "assets", event)
	},

	handleDrop(event) 
	{
		event.stopPropagation()
		event.preventDefault()
		this.$dragOver = false

		const parentAsset = store.get(`assets/${store.get("local/assets/location")}`)
		Assets.dropFiles(event.dataTransfer.items, parentAsset.id)
	},

	handleDragOver(event) {
		event.stopPropagation()
		event.preventDefault()
		event.dataTransfer.dropEffect = "copy"
	},

	handleDragEnter(event) {
		event.stopPropagation()
		event.preventDefault()
		this.$dragOver = true
	},

	handleDragLeave(event) {
		event.stopPropagation()
		event.preventDefault()
		this.$dragOver = false
	}
})

const FilesStatus = component({
	state: {
		value: null,
		name: null
	},
	render()
	{
		const item = this.$.value

		elementOpen("status")
			if(item && this.bind.value.indexOf("assets/") === 0)
			{
				const icon = Types.getIconFromType(item.type)
				elementVoid("icon", { class: `fa ${icon}` })
				if(item.ext) {
					text(`${item.name}.${item.ext}`)
				}
				else {
					text(`${item.name}`)
				}
			}
		elementClose("status")
	}
})

const Files = component
({
	state: {
		location: null,
		selected: null
	},

	mount() {
		this.attrLocation = { 
			bind: `local/assets/location` 
		}
	},

	render() 
	{
		const attrItems = { 
			bind: {
				items: `assetsChildren/${this.$.location}`,
				search: "local/assets/search"
			}
		}

		elementOpen("files")
			componentVoid(FilesLocation, this.attrLocation)
			componentVoid(FilesItems, attrItems)

			if(this.$.selected) {
				componentVoid(FilesStatus, {
					bind: { 
						value: this.$.selected,
						name: `${this.$.selected}/name`
					}
				})
			}
			else {
				componentVoid(FilesStatus)				
			}
		elementClose("files")
	},

	handleDrop(event) {
		this.$.dragOver = false
		event.stopPropagation()
		event.preventDefault()
		
		Assets.dropFiles(event.dataTransfer.items)
	},

	handleDragOver(event) {
		event.stopPropagation()
		event.preventDefault()
		event.dataTransfer.dropEffect = "copy"
	},

	handleDragEnter(event) {
		this.$dragOver = true
		event.stopPropagation()
		event.preventDefault()
	},

	handleDragLeave(event) {
		this.$dragOver = false
		event.stopPropagation()
		event.preventDefault()
	}	
})

const Browser = component({
	mount() 
	{
		this.attrDirectories = { bind: "assets" }
		this.attrFiles = { 
			bind: { 
				location: "local/assets/location",
				selected: "local/selected"
			}
		}
	},
	render()
	{
		elementOpen("browser", this.attr)
			componentVoid(Directories, this.attrDirectories)
			componentVoid(Files, this.attrFiles)
		elementClose("browser")
	}
})

export default component(
{
	mount() 
	{
		this.attr = { 
			class: "embeded-panel",
			ondrop: this.handleDrop.bind(this),
			ondragover: this.handleDragOver.bind(this),
			ondragenter: this.handleDragEnter.bind(this),
			ondragleave: this.handleDragLeave.bind(this)
		}
		this.attrUpload = { 
			id: "assets-upload", 
			type: "file", 
			onchange: this.handleUpload.bind(this) 
		}
		this.attrSearch = { bind: "local/assets/search" }
		this.attrButtonMore = {
			class: "pointer fa fa-plus",
			onclick: this.handleContextMenu.bind(this) 
		}
	},

	render()
	{
		elementOpen("assets", this.attr)
			elementOpen("header")
				text("Assets")
			elementClose("header")

			componentVoid(Search, this.attrSearch)
			elementVoid("icon", this.attrButtonMore)

			componentVoid(Browser)
			elementVoid("input", this.attrUpload)
		elementClose("assets")
	},

	handleContextMenu(event) {
		ContextMenu.show("assets", "assets", event)
	},

	handleUpload(event) {
		Assets.uploadFiles(event.currentTarget.files)
		event.target.value = ""
	},

	handleDrop(event) {
		event.stopPropagation()
		event.preventDefault()
	},

	handleDragOver(event) {
		event.stopPropagation()
		event.preventDefault()
		event.dataTransfer.dropEffect = "copy"
	},

	handleDragEnter(event) {
		event.stopPropagation()
		event.preventDefault()
	},

	handleDragLeave(event) {
		event.stopPropagation()
		event.preventDefault()
	}
})

const itemsSortFunc = function(a, b) {
	return a.localeCompare(b)
}