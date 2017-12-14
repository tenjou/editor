import Menu from "./Menu"
import Assets from "../actions/Assets"

Menu.set("prefabs", [])

Menu.set("assets", [
	{
		type: "category",
		name: "Create",
		children: [
			{
				name: "Folder",
				icon: "fa-folder",
				func() {
					Assets.createAsset("Folder", null)
				}
			},
			{
				type: "menu",
				name: "Prefabs",
				icon: "fa-cubes",
				children: "prefabs"
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
				name: "Entity",
				icon: "fa-cube",
				func() {
					Assets.createAsset("Entity", null)
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
				func: () => {
					Assets.createAsset("Text", null)
				}
			}				
		]
	}
])

Menu.set("assets.defaultItem", [
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

Menu.set("assets.item", "assets.defaultItem", [
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

Menu.set("assets.directory", "assets.masterDirectory", [
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

Menu.set("assets.Folder", "assets.Item", [
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

Menu.set("asset.item", "assets.defaultItem", [])
