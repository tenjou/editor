import { store } from "wabi"
import { uuid4, cloneObj } from "../Utils"

// const types = {
// 	HDR: {
// 		icon: "fa-map-o",
// 		mimes: {
// 			hdr: "image/x-radiance"
// 		}
// 	},


// 	Geometry: {
// 		icon: "fa-cube"
// 	},
// 	Box: {
		
// 	},
// 	Plane: {
// 		icon: "fa-cube"
// 	},
// 	Circle: {
// 		icon: "fa-cube"
// 	},
// 	Cylinder: {
// 		icon: "fa-cube"
// 	},
// 	Sphere: {
// 		icon: "fa-cube"
// 	},
// 	Icosahedron: {
// 		icon: "fa-cube"
// 	},
// 	Torus: {
// 		icon: "fa-cube"
// 	},
// 	TorusKnot: {
// 		icon: "fa-cube"
// 	},
// 	// CUSTOM
// 	Item: {
// 		icon: "fa-cube"
// 	}
// }

const types = {}
const exts = {}

const updateExts = (type) => {
	const newExts = type.exts
	for(let key in newExts) {
		exts[key] = type
	}
}

const add = (name, extend, props) =>
{
	if(!props) { 
		props = extend 
		extend = null
	}
	
	if(extend) 
	{
		const extendedType = types[extend]
		if(!extendedType) {
			console.warn(`(Types.add) No such type defined: ${extend}`)
			return
		}

		const extendedData = cloneObj(extendedType.data)

		let schema = extendedType.schema
		if(props.schema) {
			schema = schema.concat({
				name,
				type: "Group",
				children: props.schema
			})
		}

		let exts = extendedType.exts
		if(props.exts) {
			if(exts) {
				exts = Object.assing(cloneObj(exts), props.exts) 
			}
			else {
				exts = props.exts
			}
		}

		const newType = {
			type: name,
			icon: props.icon ? props.icon : extendedType.icon,
			data: Object.assign(extendedData, props.data),
			init: props.init ? extendedType.init.concat(props.init) : extendedType.init,
			open: props.open,
			exts,
			schema
		}
		types[name] = newType
		updateExts(newType)
	}
	else
	{
		if(!props.icon) {
			props.icon = "fa-question"
		}
		props.type = name
		props.init = props.init ? [ props.init ] : null
		props.schema = [{
			name,
			type: "Group",
			children: props.schema
		}]
		types[name] = props
		updateExts(props)
	}
}

const get = (name) => {
	const type = types[name]
	return type || null
}

const create = (type, parent) => 
{
	const typeInfo = types[type]
	if(!typeInfo) {
		console.warn(`(Hierarchy.createAsset) No such item type registered: ${type}`)
		return null
	}
	const data = cloneObj(typeInfo.data)
	data.type = type
	data.name = type
	data.parent = (parent !== undefined) ? parent : null

	const inits = typeInfo.init
	for(let n = 0; n < inits.length; n++) {
		inits[n].call(data)
	}

	return data
}

const createFromExt = (ext, parent) => 
{
	const typeInfo = exts[ext]
	if(!typeInfo) {
		console.warn(`(Types.createFromExt) No type found for ext: ${ext}`)
		return null
	}

	const data = create(typeInfo.type, parent)
	data.ext = ext
	return data
}

const getIconFromType = function(type) {
	const typeInfo = types[type]
	if(!typeInfo) {
		return "fa-question"
	}
	return typeInfo.icon ? typeInfo.icon : "fa-question"
}

export default {
	createFromExt,
	getIconFromType,
	add,
	get,
	create
}
