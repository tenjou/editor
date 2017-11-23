import Definitions from "./Definitions"

Definitions.add("Inspect.Torus", "Inspect.Node", {
	Mesh: {
		type: "Group",
		children: {
			Radius: {
				type: "Number",
				bind: "radius",
				$min: 0,
				$default: 2
			},
			Tube: {
				type: "Number",
				bind: "tube",
				$min: 0,
				$default: 1
			},
			RadialSegments: {
				type: "Number",
				bind: "radialSegments",
				$min: 0,
				$default: 8
			},
			TubularSegments: {
				type: "Number",
				bind: "tubularSegments",
				$min: 0,
				$default: 6
			},
			Arc: {
				type: "Number",
				bind: "arc",
				$min: 0,
				$default: Math.PI * 2
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