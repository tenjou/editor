import Definitions from "./Definitions"

Definitions.add("Inspect.Node", "Inspect.Default", {
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
	}
})