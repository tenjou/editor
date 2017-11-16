import Add from "../actions/Add"

const HierarchyMenu = [
	{
		type: "category",
		name: "create",
		children: [
			{
				icon: "fa-folder",
				name: "Folder",
				func: Add.folder
			}		
		]
	}
]

export default HierarchyMenu