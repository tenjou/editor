import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid,
	store,
	text
} from "wabi"

import TextInput from "../components/TextInput"
import Dropdown from "../components/Dropdown"
import Project from "../actions/Project"
import Definitions from "../definitions/Definitions"

export default component(
{
	mount() 
	{
		store.set("new-project", {
			name: "Untitled",
			type: null
		}, true)

		this.attrCentered = { class: "centered" }
		this.attrPanel = { class: "panel" }
		this.attrContent = { class: "column overflow-initial" }
		this.attrCubeIcon = { class: "fa fa-cube" }
		this.attrBackButton = { onclick: this.goBack.bind(this) }
		this.attrCreateProject = { onclick: this.createProject.bind(this) }
		this.attrTextInput = { bind: "new-project/name" }
		this.attrDropdown = { 
			bind: "new-project/type", 
			$source: Definitions.get("Enum.ProjectType"), 
			$valueIsId: false 
		}
	},
	render()
	{
		elementOpen("layout")
			elementOpen("content", this.attrCentered)
				elementOpen("new-project", this.attrPanel)

					elementOpen("header")
						text("New Project")
					elementClose("header")

					elementOpen("content", this.attrContent)
						elementOpen("item-row")
							elementOpen("name")
								text("Name")
							elementClose("name")
							componentVoid(TextInput, this.attrTextInput)
						elementClose("item-row")

						elementOpen("item-row")
							elementOpen("name")
								text("Type")
							elementClose("name")
							componentVoid(Dropdown, this.attrDropdown)
						elementClose("item-row")
					elementClose("content")

					elementOpen("row")
						elementOpen("button", this.attrBackButton)
							elementOpen("span")
								text("Back")
							elementClose("span")
						elementClose("button")

						elementOpen("button", this.attrCreateProject)
							elementVoid("icon", this.attrCubeIcon)
							elementOpen("span")
								text("Create")
							elementClose("span")
						elementClose("button")
					elementClose("row")
				elementClose("new-project")
			elementClose("content")
		elementClose("layout")
	},

	goBack(event) {
		document.location.hash = ""
	},

	createProject(event) {
		const data = store.get("new-project")
		Project.create(data.name, data.type, this.handleProjectCreated.bind(this))
		store.remove("new-project")
	},

	handleProjectCreated(data) {
		store.set("projects/selected", data.id)
		document.location.hash = ""
		// System.openProject()
	}
})
