import Definitions from "./Definitions"

Definitions.add("Inspect.Cubemap", "Inspect.Default", {
	Textures: {
		type: "Group",
		children: {
			px: {
				type: "Dropdown",
				bind: "textures.0",
				source: "assets.HDR.children",
				$emptyOption: true
			},
			nx: {
				type: "Dropdown",
				bind: "textures.1",
				source: "assets.HDR.children",
				$emptyOption: true
			},
			py: {
				type: "Dropdown",
				bind: "textures.2",
				source: "assets.HDR.children",
				$emptyOption: true
			},
			ny: {
				type: "Dropdown",
				bind: "textures.3",
				source: "assets.HDR.children",
				$emptyOption: true
			},
			pz: {
				type: "Dropdown",
				bind: "textures.4",
				source: "assets.HDR.children",
				$emptyOption: true
			},
			nz: {
				type: "Dropdown",
				bind: "textures.5",
				source: "assets.HDR.children",
				$emptyOption: true
			}						
		}
	}
})