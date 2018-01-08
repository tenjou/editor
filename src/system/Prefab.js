import { store } from "wabi"
import Menu from "../menu/Menu"
import Cmder from "~/Cmder"
import AddAssetCommand from "~/assets/Commands/AddAssetCommand"
import RemoveAssetCommand from "~/assets/Commands/RemoveAssetCommand"
import UpdateAssetCommand from "~/assets/Commands/UpdateAssetCommand"

const prefabsMenu = []

const createEntityFromPrefab = (id) => {
	console.log("create", id)
}

const HandleCreateAsset = (asset) =>
{
	switch(asset.type) 
	{
		case "Prefab": 
		{
			prefabsMenu.push({ 
				id: asset.id,
				name: asset.name,
				func: () => {
					createEntityFromPrefab(asset.id)
				}
			})
		} break
	}
}

const HandleRemoveAsset = (asset) => 
{
	switch(asset.type) 
	{
		case "Prefab": 
		{
			for(let n = 0; n < prefabsMenu.length; n++) {
				const item = prefabsMenu[n]
				if(item.id === asset.id) {
					prefabsMenu.splice(n, 1)
					Menu.set("prefabs", prefabsMenu)
					return
				}
			}
		} break
	}
}

const HandleUpdateAsset = (props) => 
{
	const asset = props.asset
	const key = props.key

	switch(asset.type) 
	{
		case "Prefab": 
		{
			if(key[0] === "name") {
				for(let n = 0; n < prefabsMenu.length; n++) {
					const item = prefabsMenu[n]
					if(item.id === asset.id) {
						item.name = props.value
						Menu.set("prefabs", prefabsMenu)
						return
					}
				}
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
	Menu.set("prefabs", prefabsMenu)
}

store.watch("assets", HandleAssets)

Cmder.on(AddAssetCommand, (assets) => {
	HandleCreateAsset(assets)
	Menu.set("prefabs", prefabsMenu)
})
Cmder.on(RemoveAssetCommand, HandleRemoveAsset)
Cmder.on(UpdateAssetCommand, HandleUpdateAsset)

