import Definitions from "./Definitions"
import Assets from "../actions/Assets"
import ContextMenu from "../actions/ContextMenu"

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
			Template: {
				name: "Template",
				icon: "fa-cube",
				func: () => {
					Assets.createAsset("Template", null)
				}
			},
			Enum: {
				name: "Enum",
				icon: "fa-list",
				func: () => {
					Assets.createAsset("Enum", null)
				}
			},			
			Entity: {
				name: "Entity",
				icon: "fa-cube",
				func: () => {
					Assets.createAsset("Entity", null)
				}
			},			
			Component: {
				name: "Component",
				icon: "fa-flask",
				func: () => {
					Assets.createAsset("Component", null)
				}
			},
			Text: {
				name: "Text",
				icon: "fa-font",
				func: () => {
					Assets.createAsset("Text", null)
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
					Assets.removeAsset(ContextMenu.getBind())
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
					Assets.removeAsset(ContextMenu.getBind())
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
