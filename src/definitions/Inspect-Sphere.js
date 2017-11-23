import Definitions from "./Definitions"

Definitions.add("Inspect.Sphere", "Inspect.Node", {
	Mesh: {
		type: "Group",
		children: {
			Radius: {
				type: "Number",
				bind: "radius",
				$min: 1,
				$default: 2
			},
			WidthSegments: {
				type: "Number",
				bind: "widthSegments",
				$min: 3,
				$default: 8
			},
			HeightSegments: {
				type: "Number",
				bind: "heightSegments",
				$min: 0,
				$default: 6
			},
			PhiStart: {
				type: "Number",
				bind: "phiStart",
				$min: 0,
				$default: 0
			},
			PhiLength: {
				type: "Number",
				bind: "phiLength",
				$min: 0,
				$default: Math.PI * 2
			},
			ThetaStart: {
				type: "Number",
				bind: "thetaStart",
				$min: 0,
				$default: 0
			},
			ThetaLength: {
				type: "Number",
				bind: "thetaLength",
				$min: 0,
				$default: Math.PI
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