import Definitions from "./Definitions"

Definitions.add("Inspect.SpriteMaterial", {
	Diffuse: {
		type: "Group",
		children: {	
			Map: {
				type: "Dropdown",
				bind: "map",
				source: "assets.Texture.children"
			},
			Color: {
				type: "Color",
				bind: "color"
			}
		}
	}
})