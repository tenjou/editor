import { store } from "wabi"
import Translator from "~/server/Translator"

const components = {}
const componentsList = []
const entities = {}
const prefabs = {}

class ComponentInfo {
	constructor(asset, attribs) {
		this.asset = asset
		this.attribs = attribs
	}
}

const compile = (attribs) => 
{
	const obj = {}
	for(let n = 0; n < attribs.length; n++) {
		const attrib = attribs[n]
		switch(attrib.type) {
			case "Number":
				obj[attrib.name] = attrib.value ? attrib.value : 0
				break
			case "String":
			case "Component":
			case "Image":
				obj[attrib.name] = attrib.value ? attrib.value : null
				break
			case "Boolean":
				obj[attrib.name] = attrib.value ? attrib.value : false
				break
			case "Enum":
				obj[attrib.name] = {
					source: attrib.source ? attrib.source : null,
					value: attrib.value ? attrib.value : ""
				}
				break
		}
	}

	return obj
}

const HandleCreateAsset = (asset) =>
{
	switch(asset.type) 
	{
		case "Component": 
		{
			const componentInfo = new ComponentInfo(
				asset,
				compile(asset.attribs))

			components[asset.id] = componentInfo
			componentsList.push(componentInfo)
			store.set("components", componentsList)
		} break

		case "Entity":
			entities[asset.id] = asset
			break
		case "Prefab":
			prefabs[asset.id] = asset
			break
	}
}

const HandleRemoveAsset = (asset) => 
{
	switch(asset.type) 
	{
		case "Component": 
		{
			const componentInfo = components[asset.id]
			delete components[asset.id]
			
			const index = componentsList.indexOf(componentInfo)
			componentsList[index] = componentsList[componentsList.length - 1]
			componentsList.pop()

			for(let key in entities) {
				const components = entities[key].components
				let changed = false
				for(let n = components.length - 1; n >= 0; n--) {
					const componentInfo = components[n]
					if(componentInfo.component === asset.id) {
						components.splice(n, 1)
						changed = true
					}
				}
				if(changed) {
					store.set(`assets/${key}/components`, components)
				}
			}

			store.set("components", componentsList)
		} break

		case "Entity":
			delete entities[asset.id]
			break
		case "Prefab":
			delete prefabs[asset.id]
			break
	}
}

const HandleUpdateAsset = (asset, key, value) => 
{
	switch(asset.type) 
	{
		case "Component": 
		{
			switch(key[0]) 
			{
				case "name":
					store.set("components", componentsList)
					break

				case "attribs":
					const prevInfo = components[asset.id]
					const prevValue = asset.attribs
					const newAttribs = compile(value)
					const diffs = compileAttribDiff(value, prevValue)
	
					diffAsset(asset.id, prefabs, diffs, prevValue, newAttribs)
					diffAsset(asset.id, entities, diffs, prevValue, newAttribs)

					prevInfo.attribs = newAttribs				
					break

				case "cache":
					if(key[1] === "attribs") {
						store.set(`assets/${asset.id}/cache/attribsEdited`, true)
					}
					break
			}
		} break
	}
}

const diffAsset = (componentId, assets, diffs, prevValue, newAttribs) => 
{
	for(let key in assets) {
		const asset = assets[key]
		const components = asset.components
		for(let n = 0; n < components.length; n++) 
		{
			const component = components[n]
			if(component.component !== componentId) { continue }

			let changed = false
			const data = component.data
			for(let i = 0; i < diffs.length; i++) 
			{
				const diff = diffs[i]

				switch(diff.action) 
				{
					case "add":
						data[diff.key] = newAttribs[diff.key]
						changed = true
						break

					case "remove":
						delete data[diff.key]
						changed = true
						break

					case "value":
						if(data[diff.key] === diff.value) {
							data[diff.key] = newAttribs[diff.key]
						}
						changed = true
						break

					case "rename":
						const prevValue = data[diff.value]
						delete data[diff.value]
						data[diff.key] = prevValue
						changed = true
						break
				}
			}

			if(changed) {
				store.set(`assets/${asset.id}/components/${n}/data`, data)
			}
		}
	}	
}

const HandleAssets = (payload) => 
{
	const assets = payload.value
	for(let key in assets) {
		HandleCreateAsset(assets[key])
	}	
	store.unwatch("assets", HandleAssets)

	for(let key in components) {
		updateComponent(components[key])
	}
}

const updateComponent = (component) => {
	updateComponentAttribs(component.asset.attribs)
	updateComponentAttribs(component.asset.cache.attribs)
}

const updateComponentAttribs = (attribs) => {
	for(let n = 0; n < attribs.length; n++) {
		const attrib = attribs[n]
		if(attrib.type === "Component") {
			const attribComponent = components[attrib.value.component]
			if(!attribComponent) {
				console.warn(`(ComponentService.updateComponent) No such component found: ${attrib.component}`)
				attrib.value.data = null
			}
			else {
				attrib.value.data = diff(attrib.value.data || {}, attribComponent.asset.attribs)
			}
		}
	}
}

const diff = (prevData, attribs) => 
{
	const newData = {}
	for(let n = 0; n < attribs.length; n++) {
		const attrib = attribs[n]
		const prev = prevData[attrib.name]
		switch(attrib.type) {
			case "Number":
			case "Boolean":
			case "String":
				if(typeof prev !== typeof attrib.value) {
					newData[attrib.name] = attrib.value
				}
				else {
					newData[attrib.name] = prev
				}
				break

			case "Enum":
				const enumAsset = store.data.assets[attrib.source]
				if(enumAsset.data.indexOf(prev) === -1) {
					newData[attrib.name] = attrib.value
				}
				else {
					newData[attrib.name] = prev
				}
				break

			case "List":
				console.warn("implement")
				break

			case "Image":
				const imageAsset = store.data.assets[prev]
				if(!imageAsset) {
					newData[attrib.name] = attrib.value
				}
				else {
					newData[attrib.name] = prev
				}
				break

			default:
				newData[attrib.name] = prev
				break
		}
	}

	return newData
}

const compileAttribDiff = (attribs, prevAttribs) => 
{
	const changes = []

	const attribsMap = {}
	for(let n = 0; n < attribs.length; n++) {
		const attrib = attribs[n]
		attribsMap[attrib.id] = attrib
	}

	const prevAttribsMap = {}
	for(let n = 0; n < prevAttribs.length; n++) {
		const attrib = prevAttribs[n]
		prevAttribsMap[attrib.id] = attrib
	}

	for(let key in prevAttribsMap) {
		if(attribsMap[key] === undefined) {
			const curr = prevAttribsMap[key]
			changes.push({ key: curr.name, action: "remove" })
		}
	}

	for(let key in attribsMap) {
		const curr = attribsMap[key]
		const prev = prevAttribsMap[key]	
		if(prev === undefined) {
			changes.push({ key: curr.name, action: "add" })
		}
		else if(prev.name !== curr.name) {
			changes.push({ key: curr.name, action: "rename" })
		}	
		else if(prev.type !== curr.type) {
			changes.push({ key: curr.name, action: "type" })
		}
		else if(prev.value !== curr.value) {
			changes.push({ key: curr.name, action: "value", value: prev.value })
		}
	}

	return changes
}

store.set("components", componentsList)
store.watch("assets", HandleAssets)

Translator.watch("CreateAsset", HandleCreateAsset)
Translator.watch("RemoveAsset", HandleRemoveAsset)
Translator.watch("UpdateAsset", HandleUpdateAsset)

const createValue = (type) => 
{
	switch(type) 
	{
		case "Number":
			return 0
			
		case "String":
			return ""

		case "Boolean":
			return false

		case "List":
			return {
				size: 0,
				list: [],
				cache: {
					open: true
				}
			}

		case "Component":
			return {
				component: null,
				data: null,
				cache: {
					open: true
				}
			}

		case "Enum":
		case "Image":
		default:
			return null
	}	
}

const clone = (id) => {
	const component = components[id]
	if(!component) {
		return null
	}
	return Object.assign({}, component.attribs)
}

export {
	createValue,
	clone
}