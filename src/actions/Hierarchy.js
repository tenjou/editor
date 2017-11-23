import { store } from "wabi"
import { cloneObj, uuid4 } from "../Utils"
import ContextMenu from "./ContextMenu"
import Types from "../actions/Types"

let currScene = null
let sceneChildren = {}

const createItem = function(type)
{
	if(!currScene) { 
		console.warn("(Hierarchy.createItem) Trying to create item when no scene is not active")
		return 
	}

	const item = Types.create(type)
	if(!item) { return }

	item.scene = currScene
	store.set(`assets/${currScene}/items/${item.id}`, item)
	store.add(`assets/${currScene}/children`, item.id)
}

const cloneSelected = function()
{
	const item = store.get(store.get("local/selected"))
	const newItem = cloneObj(item)
	newItem.cache = Types.create(item.type).cache
	newItem.id = uuid4()

	store.set(`assets/${currScene}/items/${newItem.id}`, newItem)
	store.add(`assets/${currScene}/children`, newItem.id)
}

const remove = (path) => 
{
	const item = store.get(path)
	const scenePath = `assets/${item.scene}`
	const scene = store.get(scenePath)

	store.remove(`sceneChildren/${scene.id}/${item.id}`)
	store.remove(`${scenePath}/children`, item.id)
	store.remove(`${scenePath}/items/${item.id}`)
}

const watchScene = (payload) => 
{
	if(payload.action === "ADD") {
		const scene = store.get(`assets/${currScene}`)
		const item = scene.items[payload.value]
		sceneChildren[scene.id][item.id] = item
	}
	else if(payload.action === "REMOVE" && payload.key === "children") {
		store.set("local/scene", null)
	}
}

store.watch("local/scene", (payload) => 
{
	if(currScene) {
		sceneChildren = {}
		store.unwatch(`assets/${currScene}/children`, watchScene)
	}

	if(payload.value) {
		const scene = store.get(`assets/${payload.value}`)
		if(scene) {
			currScene = payload.value
			prepareScene(store.get(`assets/${currScene}`))
			store.set("sceneChildren", sceneChildren)
			store.watch(`assets/${payload.value}/children`, watchScene)
			return
		}
	}

	store.set("sceneChildren", sceneChildren)
	payload.value = null
	currScene = null
})

const prepareScene = (scene) => 
{
	const children = {}
	const items = scene.items
	const childrenIds = scene.children
	if(!childrenIds) { return }
	
	for(let n = 0; n < childrenIds.length; n++) {
		const id = childrenIds[n]
		const item = items[id]
		children[id] = item
	}

	sceneChildren[scene.id] = children
}

export {
	createItem,
	cloneSelected,
	remove
}
