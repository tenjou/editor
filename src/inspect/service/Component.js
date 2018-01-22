import { store } from "wabi"
import Translator from "~/server/Translator"
import Cmder from "~/Cmder"
import AddAssetCommand from "~/assets/Commands/AddAssetCommand"
import RemoveAssetCommand from "~/assets/Commands/RemoveAssetCommand"
import UpdateAssetCommand from "~/assets/Commands/UpdateAssetCommand"

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
			case "Enum":
			case "Component":
			case "Image":
				obj[attrib.name] = attrib.value ? attrib.value : null
				break
			case "Boolean":
				obj[attrib.name] = attrib.value ? attrib.value : false
				break
		}
	}

	return obj
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

					case "rename":
						const prevValue = data[diff.prevKey]
						delete data[diff.prevKey]
						data[diff.key] = prevValue
						changed = true
						break

					case "value":
						if(data[diff.key] === diff.value) {
							data[diff.key] = newAttribs[diff.key]
						}
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
			changes.push({ key: curr.name, action: "rename", prevKey: prev.name })
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

		case "Enum":
		{
			for(let key in components) 
			{
				const component = components[key].asset

				if(removeEnumFromAttribs(component.cache.attribs, asset.id)) {
					store.set(`assets/${key}/cache/attribs`, component.cache.attribs)
				}

				const enumAttribs = getAttribsWithEnum(component.attribs, asset.id)
				if(enumAttribs) {
					removeEnumFromBuffer(entities, enumAttribs, asset.id)
					removeEnumFromBuffer(prefabs, enumAttribs, asset.id)				
					for(let n = 0; n < enumAttribs.length; n++) {
						const attrib = enumAttribs[n]
						attrib.source = null
						attrib.value = null
					}
					store.set(`assets/${key}/attribs`, component.attribs)
				}
			}
		} break

		case "Entity":
			delete entities[asset.id]
			break

		case "Prefab":
		{
			for(let key in entities) {
				const entity = entities[key]
				if(entity.prefab === asset.id) {
					store.set(`assets/${key}/prefab`, null)
				}
			}
			delete prefabs[asset.id]
		} break
	}
}

const getAttribsWithEnum = (attribs, enumId) =>
{
	let result = null
	
	for(let n = 0; n < attribs.length; n++) 
	{
		const attrib = attribs[n]
		if(attrib.type !== "Enum") { continue }
		if(attrib.source !== enumId) { continue }

		if(!result) {
			result = [ attrib ]
		}
		else {
			result.push(attrib)
		}
	}

	return result
}

const removeEnumFromAttribs = (attribs, enumId) => 
{
	let changed = false

	for(let n = 0; n < attribs.length; n++) 
	{
		const attrib = attribs[n]
		if(attrib.type !== "Enum") { continue }
		if(attrib.source !== enumId) { continue }
		
		attrib.source = null
		changed = true
	}

	return changed
}

const removeEnumFromBuffer = (buffer, enumAttribs, enumId) => 
{
	for(let key in buffer) 
	{
		const components = buffer[key].components

		for(let n = 0; n < components.length; n++) 
		{
			const data = components[n].data
			let changed = false

			for(let n = 0; n < enumAttribs.length; n++) {
				const attrib = enumAttribs[n]
				data[attrib.name].value = null
				changed = true
			}

			if(changed) {
				store.set(`assets/${key}/components/${n}/data`, data)
			}
		}
	}
}

const HandleUpdateAsset = (props) => 
{
	const asset = props.asset
	const key = props.key
	const value = props.value

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

		case "Entity":
		{
			switch(key[0])
			{
				case "prefab":
					console.log("prefab", value)
					break
			}
		} break
	}
}

store.set("components", componentsList)
store.watch("assets", HandleAssets)

Cmder.on(AddAssetCommand, (asset) => { 
	HandleCreateAsset(asset) 
	store.set("components", componentsList)
})
Cmder.on(RemoveAssetCommand, HandleRemoveAsset)
Cmder.on(UpdateAssetCommand, HandleUpdateAsset)

export {
	createValue,
	clone
}