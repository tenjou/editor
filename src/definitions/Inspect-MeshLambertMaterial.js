import Definitions from "./Definitions"

Definitions.add("Inspect.MeshLambertMaterial", {
	Texture: {
		type: "Group",
		children: {
			Map: {
				type: "Dropdown",
				bind: "map",
				source: "assets.Texture.children",
				$emptyOption: true
			},
			AlphaMap: {
				type: "Dropdown",
				bind: "alphaMap",
				source: "assets.Texture.children",
				$emptyOption: true
			},
			SpecularMap: {
				type: "Dropdown",
				bind: "specularMap",
				source: "assets.Texture.children",
				$emptyOption: true
			},
			EnvMap: {
				type: "Dropdown",
				bind: "envMap",
				source: "assets.Cubemap.children",
				$emptyOption: true
			},
			Reflectivity: {
				type: "Number",
				bind: "reflectivity",
				$min: 0,
				$max: 1,
				$default: 1
			},	
			RefractionRatio: {
				type: "Number",
				bind: "refractionRatio",
				$min: 0,
				$max: 1,
				$default: 0.98
			},				
			LightMap: {
				type: "Dropdown",
				bind: "lightMap",
				source: "assets.Texture.children",
				$emptyOption: true
			},
			AOMap: {
				type: "Dropdown",
				bind: "aoMap",
				source: "assets.Texture.children",
				$emptyOption: true
			},
			AOMapIntensity: {
				type: "Number",
				bind: "aoMapIntensity",
				$min: 0,
				$max: 1,
				$default: 1
			},
			EmissiveMap: {
				type: "Dropdown",
				bind: "emissiveMap",
				source: "assets.Texture.children",
				$emptyOption: true
			},							
		}
	},
	Color: {
		type: "Group",
		children: {
			Color: {
				type: "Color",
				bind: "color",
				$default: "#ffffff"
			},
			Emissive: {
				type: "Color",
				bind: "emissive",
				$default: "#000000"
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