import Definitions from "./Definitions"

Definitions.add("Inspect.MeshStandardMaterial", {
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
			BumpMap: {
				type: "Dropdown",
				bind: "bumpMap",
				source: "assets.Texture.children",
				$emptyOption: true
			},
			BumpScale: {
				type: "Number",
				bind: "bumpScale",
				$min: 0,
				$max: 1,
				$default: 1
			},
			NormalMap: {
				type: "Dropdown",
				bind: "normalMap",
				source: "assets.Texture.children",
				$emptyOption: true
			},
			DisplaceMap: {
				type: "Dropdown",
				bind: "displaceMap",
				source: "assets.Texture.children",
				$emptyOption: true
			},
			DisplacementScale: {
				type: "Number",
				bind: "displacementScale",
				$min: 0,
				$max: 1,
				$default: 1
			},
			RoughnessMap: {
				type: "Dropdown",
				bind: "roughnessMap",
				source: "assets.Texture.children",
				$emptyOption: true
			},
			Roughness: {
				type: "Number",
				bind: "roughness",
				$min: 0,
				$max: 1,
				$default: 0.5
			},
			MetalnessMap: {
				type: "Dropdown",
				bind: "metalnessMap",
				source: "assets.Texture.children",
				$emptyOption: true
			},
			Metalness: {
				type: "Number",
				bind: "metalness",
				$min: 0,
				$max: 1,
				$default: 0.5
			},
			EnvMap: {
				type: "Dropdown",
				bind: "envMap",
				source: "assets.Cubemap.children",
				$emptyOption: true
			},	
			EnvMapIntensity: {
				type: "Number",
				bind: "envMapIntensity",
				$min: 0,
				$max: 1,
				$default: 1
			},				
			LightMap: {
				type: "Dropdown",
				bind: "lightMap",
				source: "assets.Texture.children",
				$emptyOption: true
			},
			LightMapIntensity: {
				type: "Number",
				bind: "lightMapIntensity",
				$min: 0,
				$max: 1,
				$default: 1
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