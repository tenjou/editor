import { store } from "wabi"
import Cmder from "~/Cmder"
import AddAssetCommand from "~/assets/Commands/AddAssetCommand"
import RemoveAssetCommand from "~/assets/Commands/RemoveAssetCommand"
import UpdateAssetCommand from "~/assets/Commands/UpdateAssetCommand"

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
		case "Enum": 
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

Cmder.on(AddAssetCommand, (assets) => {
	HandleCreateAsset(assets)
	store.set("enums", enums)
})
Cmder.on(RemoveAssetCommand, HandleRemoveAsset)
Cmder.on(UpdateAssetCommand, HandleUpdateAsset)
