import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid,
	store,
	text
} from "wabi"

import Word from "./Word"
import Project from "../actions/Project"
import ContextMenu from "../actions/ContextMenu"
import { importZip } from "../actions/import"

const Import = component({
	mount()
	{
		this.propsImportButton = { onclick: this.importProject.bind(this) }
		this.propsInput = { 
			type: "file", 
			id: "import-project-upload", 
			accept: ".zip", 
			onchange: this.handleImport.bind(this) 
		}
	},

	render()
	{
		elementOpen("import")
			elementOpen("button", this.propsImportButton)
				elementVoid("icon", { class: "fa fa-upload" })
				elementOpen("span")
					text("Import")
				elementClose("span")
			elementClose("button")
			elementVoid("input", this.propsInput)
		elementClose("import")
	},

	handleImport(event) {
		importZip(event.currentTarget.files)
	},

	importProject(event) {
		const uploadElement = document.getElementById("import-project-upload")
		if(!uploadElement) {
			console.error("(Import Component) Could not find #import-project-upload element")
			return
		}

		uploadElement.click()
	}
})

const ProjectItem = component({
	state: {
		value: null,
		selected: false,
		editing: false
	},

	mount() {
		this.onclick = this.handleClick.bind(this)
		this.ondblclick = this.handleDblClick.bind(this)
		this.oncontextmenu = this.handleContextMenu.bind(this)
	},

	render()
	{
		const propsItem = {
			onclick: this.onclick,
			ondblclick: this.ondblclick,
			oncontextmenu: this.oncontextmenu
		}
		if(this.$.selected) {	
			propsItem.class = "select"
		}

		const propsWord = {
			bind: `${this.bind}/name`
		}
		if(this.$.editing) {
			propsWord.$editing = true
		}

		elementOpen("item", propsItem)
			componentVoid(Word, propsWord)
			elementOpen("tag")
				text(this.$value.type ? this.$value.type : "Unknown")
			elementClose("tag")
		elementClose("item")
	},

	handleClick(event) {
		this.select()
	},

	handleDblClick(event)
	{
		if(!this.$selected) {
			this.select()
		}
		else {
			Project.open(this.$value.id)
		}
	},

	handleContextMenu(event) {
		this.select()
		ContextMenu.show("project.item", this.bind, event)
	},

	select() {
		store.set("projects/selected", this.$value.id)
	}
})

const ProjectList = component({
	mount() {
		this.projects = []
		this.propsContent = { class: "column" }
	},
	
	render() 
	{
		const data = this.$value.data

		this.projects.length = 0
		for(let key in data) {
			this.projects.push(data[key])
		}
		
		if(this.projects.length > 0)
		{
			this.projects.sort(sortProjectsByUpdated)

			elementOpen("content", this.propsContent)

			for(let n = 0; n < this.projects.length; n++) {
				const project = this.projects[n]
				const selected = (project.id === this.$value.selected) ? true : false
				componentVoid(ProjectItem, { 
					bind: `projects/data/${project.id}`, 
					$selected: selected 
				})
			}

			elementClose("content")
		}
		else {
			elementOpen("content", { class: "column centered" })
				text("No projects created")
			elementClose("content")
		}
	}
})

const sortProjectsByUpdated = function(a, b) {
	return a.updated - b.updated
}

export default component({
	mount()
	{
		this.propsCreateButton = { onclick: this.createProject.bind(this) }
		this.propsOpenButton = { onclick: this.openProject.bind(this) }
		
		Project.fetch()
	},
	render()
	{
		elementOpen("projects", { class: "panel" })
			elementOpen("header")
				text("Projects")
			elementClose("header")

			if(this.$value.loading) {
				elementOpen("content", { class: "centered" })
					elementVoid("loader")
				elementClose("content")
			}
			else
			{
				componentVoid(ProjectList, { bind: "projects" })

				elementOpen("row")
					elementOpen("button", this.propsCreateButton)
						elementVoid("icon", { class: "fa fa-cube" })
						elementOpen("span")
							text("New Project")
						elementClose("span")
					elementClose("button")

					if(window.electron) {
						elementOpen("button", this.propsOpenButton)
							elementVoid("icon", { class: "fa fa-folder" })
							elementOpen("span")
								text("Open Project")
							elementClose("span")
						elementClose("button")
					}

					componentVoid(Import)
				elementClose("row")
			}

		elementClose("projects")
	},

	handleProjectsUpdate(payload)
	{
		this.projects.length = 0

		const data = payload.value
		for(let key in data) {
			this.projects.push(data[key])
		}

		this.projects.sort(sortProjectsByUpdated)
	},

	createProject(event) {
		document.location.hash = "new-project"
	},

	openProject(event) 
	{
		const dialog = require("electron").remote.dialog
		dialog.showOpenDialog({ properties: [ "openDirectory" ]}, 
			(paths) => {
				if(!paths) { return }
				Project.open(null, paths[0])
			})
	}
})