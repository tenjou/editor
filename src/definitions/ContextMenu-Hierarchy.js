import Definitions from "./Definitions"
import ContextMenu from "../actions/ContextMenu"
import Inspect from "../actions/Inspect"
import Hierarchy from "../actions/Hierarchy"

Definitions.add("Context.Hierarchy", {
	Create: {
		type: "category",
		index: 100,
		children: {
			Scene: {
				name: "Scene",
				icon: "fa-database",
				func: () => {
					Hierarchy.createItem("Scene", "Scene", "hierarchy")
				}
			}
		}
	}
})

Definitions.add("Context.Hierarchy.Item", "Context.Hierarchy.Scene", {
	Actions: {
		type: "category",
		children: {
			Clone: {
				icon: "fa-clone",
				func: () => {
					Hierarchy.cloneSelected()
				}
			},
			Delete: {
				icon: "fa-trash",
				func: () => {
					Hierarchy.remove(store.get("contextmenu/bind"))
				}
			}
		}
	}
})

const nodeParams = {
	position: [ 0, 0, 0 ],
	rotation: [ 0, 0, 0 ],
	scale: [ 1, 1, 1 ]
}
const lightParams = {
	position: [ 0, 10, 0 ],
	rotation: [ 0, 0, 0 ],
	scale: [ 1, 1, 1 ]
}

Definitions.add("Context.Hierarchy.Scene", {
	Create: {
		type: "category",
		index: 100,
		children: {
			Geometry: {
				name: "Geometry",
				icon: "fa-cube",
				func: () => {
					Hierarchy.createItem("Geometry", nodeParams)
				}
			},
			Plane: {
				name: "Plane",
				icon: "fa-cube",
				func: () => {
					Hierarchy.createItem("Plane", nodeParams)
				}
			},
			Box: {
				name: "Box",
				icon: "fa-cube",
				func: () => {
					Hierarchy.createItem("Box")
				}
			},
			Circle: {
				name: "Circle",
				icon: "fa-cube",
				func: () => {
					Hierarchy.createItem("Circle", nodeParams)
				}
			},
			Cylinder: {
				name: "Cylinder",
				icon: "fa-cube",
				func: () => {
					Hierarchy.createItem("Cylinder", nodeParams)
				}
			},
			Sphere: {
				name: "Sphere",
				icon: "fa-cube",
				func: () => {
					Hierarchy.createItem("Sphere", nodeParams)
				}
			},
			Icosahedron: {
				name: "Icosahedron",
				icon: "fa-cube",
				func: () => {
					Hierarchy.createItem("Icosahedron", nodeParams)
				}
			},
			Torus: {
				name: "Torus",
				icon: "fa-cube",
				func: () => {
					Hierarchy.createItem("Torus", nodeParams)
				}
			},
			TorusKnot: {
				name: "TorusKnot",
				icon: "fa-cube",
				func: () => {
					Hierarchy.createItem("TorusKnot", nodeParams)
				}
			},
			Sprite: {
				name: "Sprite",
				icon: "fa-tree",
				func: () => {
					Hierarchy.createItem("Sprite", nodeParams)
				}
			},
		}
	},
	Lighting: {
		type: "category",
		index: 100,
		children: {
			DirectionalLight: {
				name: "DirectionalLight",
				icon: "fa-lightbulb-o",
				func: () => {
					Hierarchy.createItem("DirectionalLight", lightParams)
				}
			},
			PointLight: {
				name: "PointLight",
				icon: "fa-lightbulb-o",
				func: () => {
					Hierarchy.createItem("PointLight", lightParams)
				}
			},
			SpotLight: {
				name: "SpotLight",
				icon: "fa-lightbulb-o",
				func: () => {
					Hierarchy.createItem("SpotLight", lightParams)
				}
			},
			HemisphereLight: {
				name: "HemisphereLight",
				icon: "fa-lightbulb-o",
				func: () => {
					Hierarchy.createItem("HemisphereLight", lightParams)
				}
			},
			AmbientLight: {
				name: "AmbientLight",
				icon: "fa-lightbulb-o",
				func: () => {
					Hierarchy.createItem("AmbientLight", lightParams)
				}
			},
		}
	}
})
