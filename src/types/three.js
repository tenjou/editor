import Types from "../actions/Types"

Types.add("Object3D", "General", {
	icon: "fa-cube",
	data: {
		scene: null,
		position: [ 0, 0, 0 ],
		rotation: [ 0, 0, 0 ],
		scale: [ 1, 1, 1 ]
	},
	schema: [
		{
			name: "Position",
			type: "Vector3",
			bind: "position"
		},
		{
			name: "Rotation",
			type: "Vector3",
			bind: "rotation",
			angle: true
		},
		{
			name: "Scale",
			type: "Vector3",
			bind: "scale"
		}
	]
})

Types.add("Scene", "Object3D", {
	icon: "fa-database",
	data: {
		children: [],
		items: {}
	},
	open() {
		store.set("local/scene", this.id)
	}
})

Types.add("Box", "Object3D", {
	icon: "fa-cube",
	data: {
		width: 1,
		height: 1,
		depth: 1,
		widthSegments: 1,
		heightSegments: 1,
		depthSegments: 1
	},
	schema: [
		{
			name: "Width",
			type: "Number",
			bind: "width",
			$min: 0
		},
		{
			name: "Height",
			type: "Number",
			bind: "height",
			$min: 0
		},
		{
			name: "Depth",
			type: "Number",
			bind: "depth",
			$min: 0
		},
		{
			name: "WidthSegments",
			type: "Number",
			bind: "widthSegments",
			$min: 1
		},
		{
			name: "HeightSegments",
			type: "Number",
			bind: "heightSegments",
			$min: 1
		},
		{
			name: "DepthSegments",
			type: "Number",
			bind: "depthSegments",
			$min: 1
		}
	]
})

Types.add("Circle", "Object3D", {
	icon: "fa-cube",
	data: {
		radius: 2,
		segments: 32,
		thetaStart: 0,
		thetaEnd: Math.PI * 2
	},
	schema: [
		{
			name: "Radius",
			type: "Number",
			bind: "radius",
			$min: 0
		},
		{
			name: "Segments",
			type: "Number",
			bind: "segments",
			$min: 0
		},
		{
			name: "ThetaStart",
			type: "Number",
			bind: "thetaStart",
			$min: 0
		},
		{
			name: "ThetaEnd",
			type: "Number",
			bind: "thetaEnd",
			$min: 0
		}
	]
})
