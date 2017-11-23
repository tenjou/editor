import Definitions from "./Definitions"

Definitions.add("Inspect.Mesh", "Inspect.Default", {
	Children: {
		type: "Group",
		children: {
			Inspect: {
				type: "MeshInspect"
			}
		}
	},
	Renderer: {
		type: "Group",
		children: {
			Material: {
				type: "Dropdown",
				local: "selected",
				bind: "material",
				source: "assets.Material.children",
				$emptyOption: true
			}
		}
	},
	Material: {
		type: "Category",
		local: "selected",
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