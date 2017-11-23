import Definitions from "./Definitions"

Definitions.add("Inspect.Circle", "Inspect.Node", {
	Mesh: {
		type: "Group",
		children: {
			Radius: {
				type: "Number",
				bind: "radius",
				$min: 0,
				$default: 2
			},
			Segments: {
				type: "Number",
				bind: "segments",
				$min: 3,
				$default: 8
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