import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import Project from "../actions/Project"

const ProjectsList = component
({
	render() {

	}
})

const Projects = component
({
	mount() {
		this.attrButtonCreate = { onclick: this.createProject.bind(this) }
		Project.fetch()
	},

	render() 
	{
		const projects = this.$value

		elementOpen("panel")
			elementOpen("projects")
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
					componentVoid(ProjectsList, { bind: "projects" })

					elementOpen("row")
						elementOpen("button", this.attrButtonCreate)
							elementVoid("icon", { class: "fa fa-cube" })
							elementOpen("span")
								text("New Project")
							elementClose("span")
						elementClose("button")
					elementClose("row")
				}
			elementClose("projects")
		elementClose("panel")
	},

	createProject() {

	}
})

export default Projects