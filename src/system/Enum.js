import { store } from "wabi"
import Translator from "../server/Translator"

const enums = {}

const HandleCreateAsset = (asset, skip) =>
{
	switch(asset.type) 
	{
		case "Enum": 
			enums[asset.name] = asset.id
			store.set("enums", enums)
			break
	}
}

const HandleRemoveAsset = (asset) => 
{
	switch(asset.type) 
	{
		case "Template": 
			delete enums[asset.name]
			store.set("enums", enums)
			break			
	}
}

const HandleUpdateAsset = (asset, key, value) => 
{
	switch(asset.type) 
	{
		case "enum": 
			store.set("enums", enums)
			break
	}
}

const HandleAssets = (payload) => 
{
	const assets = payload.value
	for(let key in assets) {
		HandleCreateAsset(assets[key])
	}	
	store.set("enums", enums)
	store.unwatch("assets", HandleAssets)
}

store.watch("assets", HandleAssets)

Translator.watch("CreateAsset", HandleCreateAsset)
Translator.watch("RemoveAsset", HandleRemoveAsset)
Translator.watch("UpdateAsset", HandleUpdateAsset)
