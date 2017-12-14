import { store } from "wabi"
import Translator from "../server/Translator"
import Menu from "../menu/Menu"

const prefabs = []

const HandleCreateAsset = (asset, update) =>
{
	switch(asset.type) 
	{
		case "Prefab": 
		{
			prefabs.push(asset)
		} break
	}

	if(update) {
		Menu.set("prefabs", prefabs)
	}
}

const HandleRemoveAsset = (asset) => 
{
	switch(asset.type) 
	{
		case "Prefab": 
		{

		} break
	}
}

const HandleUpdateAsset = (asset, key, value) => 
{
	switch(asset.type) 
	{
		case "Prefab": 
		{

		} break
	}
}

const HandleAssets = (payload) => 
{
	const assets = payload.value
	for(let key in assets) {
		HandleCreateAsset(assets[key], false)
	}	
	store.unwatch("assets", HandleAssets)
	Menu.set("prefabs", prefabs)
}

store.watch("assets", HandleAssets)

Translator.watch("CreateAsset", (asset) => { HandleCreateAsset(asset, true) })
Translator.watch("RemoveAsset", HandleRemoveAsset)
Translator.watch("UpdateAsset", HandleUpdateAsset)
