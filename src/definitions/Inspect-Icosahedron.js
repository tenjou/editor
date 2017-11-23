import Definitions from "./Definitions"

Definitions.add("Inspect.Icosahedron", "Inspect.Node", {
	Mesh: {
		type: "Group",
		children: {
			Radius: {
				type: "Number",
				bind: "radius",
				$min: 0,
				$default: 1
			},
			Detail: {
				type: "Number",
				bind: "detail",
				$min: 0,
				$default: 0
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
			}
		}
	}	
})