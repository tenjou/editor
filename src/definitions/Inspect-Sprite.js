import Definitions from "./Definitions"

Definitions.add("Inspect.Sprite", "Inspect.Default", {
	Transform: {
		type: "Group",
		children: {
			Position: {
				type: "Vector3",
				bind: "position"
			},
			Rotation: {
				type: "Vector3",
				bind: "rotation",
				angle: true
			},
			Scale: {
				type: "Vector3",
				bind: "scale"
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