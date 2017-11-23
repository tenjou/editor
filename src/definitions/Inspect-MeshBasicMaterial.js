import Definitions from "./Definitions"

Definitions.add("Inspect.MeshBasicMaterial", {
	Diffuse: {
		type: "Group",
		children: {
			Map: {
				type: "Dropdown",
				bind: "map",
				source: "assets.Texture.children",
				$emptyOption: true
			},
			Color: {
				type: "Color",
				bind: "color",
				$default: "#ffffff"
			},
			Shading: {
				type: "Dropdown",
				bind: "shading",
				source: "local.enum.Shading",
				$default: "SmoothShading",
				$valueIsId: false
			}
		}
	}
})