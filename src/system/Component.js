import { store } from "wabi"
import Translator from "../server/Translator"

const components = {}
const componentsList = []
const entities = {}

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
				obj[attrib.name] = attrib.value ? attrib.value : null
				break
			case "Boolean":
				obj[attrib.name] = attrib.value ? attrib.value : false
		}
	}

	return obj
}

const clone = (id) => {
	const component = components[id]
	if(!component) {
		return null
	}
	return Object.assign({}, component.attribs)
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
					const component = components[n]
					if(component.id === asset.id) {
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
					prevInfo.attribs = newAttribs
					for(let key in entities) {
						const components = entities[key].components
						for(let n = 0; n < components.length; n++) {
							const component = components[n]
						}
					}
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

const HandleAssets = (payload) => 
{
	const assets = payload.value
	for(let key in assets) {
		HandleCreateAsset(assets[key])
	}	
	store.unwatch("assets", HandleAssets)
}

store.set("components", componentsList)
store.watch("assets", HandleAssets)

Translator.watch("CreateAsset", HandleCreateAsset)
Translator.watch("RemoveAsset", HandleRemoveAsset)
Translator.watch("UpdateAsset", HandleUpdateAsset)

export {
	clone
}