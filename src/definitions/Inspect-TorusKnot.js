import Definitions from "./Definitions"

Definitions.add("Inspect.TorusKnot", "Inspect.Node", {
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
			p: {
				type: "Number",
				bind: "p",
				$min: 0,
				$default: 2
			},
			q: {
				type: "Number",
				bind: "q",
				$min: 0,
				$default: 3
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