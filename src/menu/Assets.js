import Menu from "./Menu"
import Assets from "../actions/Assets"
import ContextMenu from "../actions/ContextMenu"

Menu.set("prefabs", [])

Menu.set("assets", "assets.upload", [
	{
		type: "category",
		name: "Create",
		index: 100,
		children: [
			{
				name: "Folder",
				icon: "fa-folder",
				func() {
					Assets.createAsset("Folder", null)
				}
			},
			{
				name: "Entity",
				icon: "fa-cube",
				children: "prefabs",
				func() {
					Assets.createAsset("Entity", null)
				}			
			},
			{
				name: "Prefab",
				icon: "fa-cubes",
				func() {
					Assets.createAsset("Prefab", null)
				}
			},
			{
				name: "Enum",
				icon: "fa-list",
				func() {
					Assets.createAsset("Enum", null)
				}
			},		
			{
				name: "Component",
				icon: "fa-flask",
				func() {
					Assets.createAsset("Component", null)
				}
			},
			{
				name: "Text",
				icon: "fa-font",
				func() {
					Assets.createAsset("Text", null)
				}
			}				
		]
	}
])

Menu.set("assets.item", [
	{
		name: "Actions",
		type: "category",
		children: [
			{
				name: "Delete",
				icon: "fa-trash",
				func() {
					Assets.removeAsset(ContextMenu.getBind())
				}
			}
		]
	}
])

Menu.set("assets.upload", [
	{
		name: "Actions",
		type: "category",
		children: [
			{
				name: "Upload",
				icon: "fa-upload",
				func: Assets.upload
			}
		]
	}
])

Menu.set("assets.masterDirectory", "assets", [
	{
		name: "Actions",
		type: "category",
		children: [
			{
				name: "Upload",
				icon: "fa-upload",
				func: Assets.upload
			}
		]
	}
])

Menu.set("assets.Folder", [ "assets.upload", "assets.item" ], [
	{
		name: "Actions",
		type: "category",
		children: [
			{
				name: "Open",
				icon: "fa-folder-open",
				func: Assets.openSelected,
				index: 9999
			}
		]
	}
])

Menu.set("assets.Text", "assets.item", [
	{
		name: "Actions",
		type: "category",
		children: [
			{
				name: "Open",
				icon: "fa-folder-open",
				func: Assets.openSelected,
				index: 9999
			}
		]
	}
])
