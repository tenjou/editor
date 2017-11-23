import Definitions from "./Definitions"
import Project from "../actions/Project"

Definitions.add("Context.Project.Item", 
{
	Actions: {
		type: "category",
		children: {
			Delete: {
				icon: "fa-trash",
				func: () => {
					Project.removeSelected()
				}
			}
		}
	}
})