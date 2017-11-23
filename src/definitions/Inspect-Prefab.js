import Definitions from "./Definitions"

Definitions.add("Inspect.Prefab", "Inspect.Default", {
	Geometry: {
		type: "Group",
		children: {
			Mesh: {
				type: "Dropdown",
				bind: "mesh",
				source: "assets.Mesh.children",
				$emptyOption: true
			}
		}
	},
	Renderer: {
		type: "Group",
		children: {
			Material: {
				type: "Dropdown",
				bind: "material",
				source: "assets.Material.children",
				$emptyOption: true
			}
		}
	},
	Material: {
		type: "Category",
		bind: "material",
		source: "assets.Material.children",
		children: {
			MaterialPlaceholder: {
				type: "Placeholder",
				def: "Material"
			},
		}
	}
})