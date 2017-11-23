import Definitions from "./Definitions"

Definitions.add("Inspect.Cylinder", "Inspect.Node", {
	Mesh: {
		type: "Group",
		children: {
			RadiusTop: {
				type: "Number",
				bind: "radiusTop",
				$min: 0,
				$default: 1
			},
			RadiusBottom: {
				type: "Number",
				bind: "radiusBottom",
				$min: 0,
				$default: 1
			},
			Height: {
				type: "Number",
				bind: "height",
				$min: 0,
				$default: 2
			},
			RadialSegments: {
				type: "Number",
				bind: "radialSegments",
				$min: 8,
				$default: 8
			},
			HeightSegments: {
				type: "Number",
				bind: "heightSegments",
				$min: 1,
				$default: 1
			},
			ThetaStart: {
				type: "Number",
				bind: "thetaStart",
				$min: 0,
				$default: 0
			},
			ThetaEnd: {
				type: "Number",
				bind: "thetaEnd",
				$min: 0,
				$default: Math.PI * 2
			},
			OpenEnded: {
				type: "Checkbox",
				bind: "openEnded"
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