import Menu from "./Menu"
import Inspect from "../controllers/Inspect"
import Commands from "../Commands"
import History from "../History"

Menu.add("HierarchyItem", "Hierarchy", [
	{
		type: "category",
		name: "Actions",
		children: [
			{
				icon: "fa-trash",
				name: "Remove",
				func() {
					const item = Inspect.getSelectedData()
					History.execute(new Commands.RemoveItem(item))
				}
			}		
		]
	}
])
