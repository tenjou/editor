import Definitions from "./Definitions"
import Assets from "../actions/Assets"

Definitions.add("Context.Assets", {
	Create: {
		type: "category",
		children: {
			Folder: {
				name: "Folder",
				icon: "fa-folder",
				func: () => {
					Assets.createAsset("Folder", null)
				}
			},
			Material: {
				name: "Material",
				icon: "fa-diamond",
				func: () => {
					Assets.createAsset("Material", null)
				}
			},
			// Entity: {
			// 	name: "Entity",
			// 	icon: "fa-cube",
			// 	func: () => {
			// 		Assets.createItem("Prefab", "Prefab", "assets.Prefab.children")
			// 	}
			// },
			Cubemap: {
				name: "Cubemap",
				icon: "fa-map",
				func: () => {
					const data = {
						textures: [ null, null, null, null, null, null ]
					}
					Assets.createAsset("Cubemap", data)
				}
			},
			Scene: {
				name: "Scene",
				icon: "fa-database",
				func: () => {
					Assets.createAsset("Scene")
				}
			},				
		}
	},
	Custom: {
		type: "category",
		children: {
			Item: {
				name: "Item",
				icon: "fa-cube",
				func() {
					Assets.createAsset("Item")
				}
			}
		}
	},
	Actions: {
		type: "category",
		children: {
			Upload: {
				icon: "fa-upload",
				func: Assets.upload
			}
		}
	}
})

Definitions.add("Context.Assets.DefaultItem", {
	Actions: {
		type: "category",
		children: {
			Delete: {
				icon: "fa-trash",
				func: () => {
					Assets.removeAsset(store.get("contextmenu/bind"))
				}
			}
		}
	}
})

Definitions.add("Context.Assets.Item", "Context.Assets.DefaultItem", {
	Actions: {
		type: "category",
		children: {
			Upload: {
				icon: "fa-upload",
				func: Assets.upload
			}
		}
	}
})

Definitions.add("Context.Assets.Folder", "Context.Assets.Item", {
	Actions: {
		type: "category",
		children: {
			Open: {
				icon: "fa-folder-open",
				func: Assets.openSelected,
				index: 9999
			}
		}
	}
})

Definitions.add("Context.Assets.MasterDirectory", "Context.Assets", {
	Actions: {
		type: "category",
		children: {
			Upload: {
				icon: "fa-upload",
				func: Assets.upload
			}
		}
	}
})

Definitions.add("Context.Assets.Directory", "Context.Assets.MasterDirectory", {
	Actions: {
		type: "category",
		children: {
			Delete: {
				icon: "fa-trash",
				func: () => {
					Assets.removeAsset(store.get("contextmenu/bind"))
				}
			}
		}
	}
})

Definitions.add("Context.Assets.Scene", "Context.Assets.DefaultItem", {
	Actions: {
		type: "category",
		children: {
			Open: {
				action: "dblclick",
				icon: "fa-folder-open",
				index: 10,
				func: Assets.open
			}
		}
	}
})

Definitions.add("Context.Asset.Item", "Context.Assets.DefaultItem", {})
