import Definitions from "./Definitions"

Definitions.add("Inspect.Geometry", "Inspect.Default", {
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
	Geometry: {
		type: "Group",
		children: {
			Mesh: {
				type: "Dropdown",
				bind: "mesh",
				source: "assets.Mesh.children",
				$emptyOption: true
			}
		}
	},
	Signage: {
		type: "Group",
		children: {
			SignageId: {
				type: "String",
				bind: "value"
			},
			SignageType: {
				type: "Dropdown",
				bind: "signageType",
				source: "local.enum.SignageType",
				$emptyOption: true,
				$valueIsId: false
			}
		}
	},
	Mesh: {
		type: "Category",
		bind: "mesh",
		source: "assets.Mesh.children",
		children: {
			MeshPlaceholder: {
				type: "Placeholder",
				def: "Mesh"
			},
		}
	}
})