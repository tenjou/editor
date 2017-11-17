import Menu from "./Menu"
import Add from "../actions/Add"

Menu.add("Hierarchy", [
	{
		type: "category",
		name: "Create",
		children: [
			{
				icon: "fa-folder",
				name: "Folder",
				func: Add.folder
			}		
		]
	}
])
