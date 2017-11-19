
const types = {}

const define = (typeDef) => {
	types[typeDef.type] = typeDef
}

const getType = (type) => {
	return types[type] || null
}

define({
	type: "Folder",
	icon: "fa-folder"
})
define({
	type: "Text",
	icon: "fa-font"
})

export {
	define,
	getType
}