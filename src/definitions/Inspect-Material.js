import Definitions from "./Definitions"

Definitions.add("Inspect.Material", "Inspect.Default", {
	General: {
		type: "Group",
		children: {
			Type: {
                type: "TypeDropdown",
                bind: "materialType",
                source: "local.enum.MaterialType",
				$default: "MeshPhongMaterial"
			}
		}
	},
	Settings: {
		type: "Group",
		children: {
			Transparent: {
				type: "Checkbox",
				bind: "transparent"
			},
			Opacity: {
				type: "Number",
				bind: "opacity",
				$min: 0,
				$max: 1,
				$default: 1
			},
			DepthTest: {
				type: "Checkbox",
				bind: "depthTest",
				$default: true
			},
			DepthWrite: {
				type: "Checkbox",
				bind: "depthWrite",
				$default: true
			},
			AlphaTest: {
				type: "Checkbox",
				bind: "alphaTest"
			},
			Visible: {
				type: "Checkbox",
				bind: "visible",
				$default: true
			},	
			Side: {
				type: "Dropdown",
				bind: "side",
				source: "local.enum.SideType",
				$default: "FrontSide",
				$valueIsId: false
			},
			Wireframe: {
				type: "Checkbox",
				bind: "wireframe"
			}			
		}
	}
})