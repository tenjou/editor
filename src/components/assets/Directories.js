import {
	store,
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid,
	text
} from "wabi"

import Assets from "../../actions/Assets"
import ContextMenu from "../../actions/ContextMenu"
import Word from "../Word"

const Directory = component({
	state: {
		value: null,
		open: false,
		selected: false,
		dragOver: false
	},
	mount()
	{
		this.numDragEnters = 0
		this.word = null
		this.attr = {
			"data-id": "",
			tabindex: 0,
			draggable: "true",
			class: "",
			onclick: this.handleClick.bind(this),
			oncontextmenu: this.handleContextMenu.bind(this),
			ondragstart: this.handleDragStart.bind(this),
			ondragenter: this.handleDragEnter.bind(this),
			ondragleave: this.handleDragLeave.bind(this),
			ondragover: this.handleDragMove.bind(this),
			ondrop: this.handleDrop.bind(this),
			onkeyup: this.handleKeyUp.bind(this)
		}

		const handleCaretClickFunc = this.handleCaretClick.bind(this)
		this.attrCaretOpen = {
			class: "fa fa-caret-down",
			onclick: handleCaretClickFunc
		}
		this.attrCaretClose = {
			class: "fa fa-caret-right",
			onclick: handleCaretClickFunc
		}
	},
	render()
	{
		const item = this.$.value

		let classes = "invisible-scrollbar"
		if(this.$.selected) {
			classes += " selected"
		}
		if(this.$.dragOver) {
			classes += " hover"
		}
		const attr = Object.assign({}, this.attr)
		attr["data-id"] = item.id
		attr.class = classes

		if(item.id === "") {
			delete attr.draggable
		}

		const open = this.$.open
		const children = this.$.children

		let folders = null
		if(children) {
			folders = collectFolders(children)
			if(folders) {
				folders.sort(sortByName)
			}
		}

		elementOpen("directory", attr)
			if(folders) {
				elementVoid("caret", open ? this.attrCaretOpen : this.attrCaretClose)
			}
			else {
				elementVoid("caret")
			}

			elementVoid("icon", attrFolderIcon)
			elementOpen("name")
				if(this.bind.value === "assets/") {
					text("Assets")
				}
				else {
					this.word = componentVoid(Word, { bind: `${this.bind.value}/name`})
				}
			elementClose("name")
		elementClose("directory")

		if(open && folders)
		{
			const rootPath = this.bind.value ? `assetsChildren/${this.bind.value.id}/` : `assetsChildren/`

			elementOpen("list")
				for(let n = 0; n < folders.length; n++) {
					const item = folders[n]
					const itemPath = `assets/${item.id}`
					componentVoid(Directory, {
						bind: {
							value: itemPath,
							children: `assetsChildren/${item.id}`,
							open: `${itemPath}/cache/open`,
							selected: `${itemPath}/cache/selectedDirectory`
						}
					})
				}
			elementClose("list")
		}
	},

	handleClick(event)
	{
		if(event.detail % 2) {
			store.set("local/assets/location", this.$.value.id)
		}
		else {
			this.handleCaretClick(event)
		}
	},

	handleContextMenu(event) 
	{
		store.set("local/assets/location", this.$.value.id)
		if(this.$.value.id === "") {
			ContextMenu.show("assets.masterDirectory", this.bind.value, event)
		}
		else {
			ContextMenu.show("assets.directory", this.bind.value, event)
		}
	},

	handleCaretClick(event) {
		event.stopPropagation()
		this.$open = !this.$.open
	},

	handleDragStart(event) {
		event.dataTransfer.setData(event.target.dataset.id, "")
		event.dataTransfer.effectAllowed = "move"
	},

	handleDragMove(event) 
	{
		event.stopPropagation()
		event.preventDefault()

		const data = event.dataTransfer.types[0]
		if(data && this.isDropValid(data)) {
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

	handleDrop(event)
	{
		event.stopPropagation()
		event.preventDefault()
		this.$dragOver = false
		this.numDragEnters = 0

		const data = event.dataTransfer.types[0]
		if(data && this.isDropValid(data)) {
			Assets.move(event.currentTarget.dataset.id, data)
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

		if(parentPath === itemPath) { return false }
		if(parentPath.indexOf(itemPath) === 0) {
			const parentSegments = parentPath.split("/")
			const itemSegments = itemPath.split("/")
			if(parentSegments.length > itemSegments.length) {
				return false
			}
		}

		return true
	}
})

const Directories = component({
	render()
	{
		elementOpen("directories")
			componentVoid(Directory, {
				bind: {
					value: "assets/",
					children: "assetsChildren/",
					open: "assets//cache/open",
					selected: "assets//cache/selectedDirectory"
				}
			})
		elementClose("directories")
	}
})

const attrFolderIcon = { class: "fa fa-folder" }

const collectFolders = function(children) {
	const result = []
	for(let key in children) {
		const item = children[key]
		if(item.type !== "Folder") { continue }
		result.push(item)
	}
	if(result.length === 0) {
		return null
	}
	return result
}

const sortByName = function(a, b) {
	return a.name.localeCompare(b.name, "en", { numeric: true })
}

export default Directories
