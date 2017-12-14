import Menu from "./Menu"
import Project from "../actions/Project"

Menu.set("project.item", [
	{
		name: "Actions",
		type: "category",
		children: [
			{
				name: "Delete",
				icon: "fa-trash",
				func() {
					Project.removeSelected()
				}
			}
		]
	}
])
