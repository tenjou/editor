
const defs = {}
let depthIndex = 0

function Definition(id, extend, props) {
	this.id = id
	this.props = props
	this.extend = extend ? [ extend ] : null
}

const add = function(id, extend, props)
{
	if(!props) {
		props = extend
		extend = null
	}

	if(!props) {
		console.warn("(Definitions.add) Invalid properties passed for id: " + id)
		return
	}
	
	let def = defs[id]
	if(def) {
		console.warn("(Definitions.add) There is already an item with such id: " + id)
		return
	}

	def = new Definition(id, extend, props)
	defs[id] = def
}

const get = function(id)
{
	const def = defs[id]
	if(!def) {
		console.warn("(Definitions.show) No such menu added: " + id)
		return null
	}

	depthIndex = 0

	let props
	if(def.extend) 
	{
		props = {}
		extendDef(props, def)
		props = createFromProps(props)
	}
	else {
		props = createFromProps(def.props)
	}

	return props
}

const extendDef = function(src, def)
{
	const extend = def.extend
	if(extend) 
	{
		for(let n = 0; n < extend.length; n++) 
		{
			const id = extend[n]
			const defExtend = defs[id]
			if(!defExtend) {
				console.warn("(Definitions.extend) No such item defined: " + id)
				continue;
			}

			extendDef(src, defExtend)
		}
	}

	mergeProps(src, def.props)
}

const mergeProps = function(src, props)
{
	for(let key in props)
	{
		const state = props[key]
		const prevState = src[key]

		if(!prevState) 
		{
			const newState = {}
			Object.assign(newState, state)
			if(newState.children) {
				newState.children = {}
				Object.assign(newState.children, state.children)
			}

			src[key] = newState
		}
		else
		{
			if(state.children) 
			{
				if(prevState.children) {
					mergeProps(prevState.children, state.children)
				}
				else {
					prevState.children = {};
					Object.assign(prevState.children, state.children)
				}
			}
		}
	}
}

const createFromProps = function(props)
{
	if(Array.isArray(props)) { return props }

	const result = []

	for(let key in props)
	{
		const item = props[key]
		const resultItem = Object.assign({}, item)
		resultItem.name = item.name || key

		if(!resultItem.index) {
			resultItem.index = depthIndex
			depthIndex -= 0.000001
		}

		if(item.children) {
			resultItem.children = createFromProps(item.children)
		}

		result.push(resultItem)
	}

	result.sort(sortByIndex)

	return result
}

const sortByIndex = function(a, b) 
{
	if(a.index === undefined) {
		return b.index
	}
	if(b.index === undefined) {
		return a.index
	}

	return b.index - a.index
}

export default {
	Definition,
	add,
	get
}