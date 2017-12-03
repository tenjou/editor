import { store } from "wabi"
import Translator from "../server/Translator"

const templates = []

const HandleCreateAsset = (asset) =>
{
	switch(asset.type) 
	{
		case "Template": 
		{

		} break
	}
}

const HandleRemoveAsset = (asset) => 
{
	switch(asset.type) 
	{
		case "Template": 
		{

		} break
	}
}

const HandleUpdateAsset = (asset, key, value) => 
{
	switch(asset.type) 
	{
		case "Template": 
		{

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

store.watch("assets", HandleAssets)

Translator.watch("CreateAsset", HandleCreateAsset)
Translator.watch("RemoveAsset", HandleRemoveAsset)
Translator.watch("UpdateAsset", HandleUpdateAsset)
