import Definitions from "./Definitions"

Definitions.add("Inspect.Plane", "Inspect.Node", {
	Mesh: {
		type: "Group",
		children: {
			Width: {
				type: "Number",
				bind: "width",
				$min: 1,
				$default: 1
			},
			Height: {
				type: "Number",
				bind: "height",
				$min: 1,
				$default: 1
			},
			WidthSegments: {
				type: "Number",
				bind: "widthSegments",
				$min: 1,
				$default: 1
			},
			HeightSegments: {
				type: "Number",
				bind: "heightSegments",
				$min: 1,
				$default: 1
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