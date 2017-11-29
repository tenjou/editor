import { store } from "wabi"
import Translator from "../server/Translator"

const components = {}
const componentsName = []
const entities = []

const HandleAssets = (payload) => 
{
	const assets = payload.value
	for(let key in assets) {
		const asset = assets[key]
		switch(asset.type) {
			case "Component":
				components[asset.id] = asset
				componentsName.push(asset.name)
				break
			case "Entity":
				entities[asset.id] = asset
				break
		}
	}	
	store.unwatch("assets", HandleAssets)
}

const HandleCreateAsset = (asset) =>
{
	switch(asset.type) 
	{
		case "Component": 
		{
			components[asset.id] = asset
			componentsName.push(asset.name)

			store.set("components", componentsName)
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
			delete components[asset.id]
			const index = componentsName.indexOf(asset.name)
			componentsName.splice(index, 1)

			store.set("components", componentsName)
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
			if(key === "name") {
				const index = componentsName.indexOf(asset.name)
				componentsName[index] = value
				store.set("components", componentsName)
			}
		} break
	}
}

store.set("components", componentsName)
store.watch("assets", HandleAssets)

Translator.watch("CreateAsset", HandleCreateAsset)
Translator.watch("RemoveAsset", HandleRemoveAsset)
Translator.watch("UpdateAsset", HandleUpdateAsset)
