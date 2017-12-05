import { store } from "wabi"
import Persistence from "../Persistence"
import FileSystem from "../fs/FileSystem"
import Assets from "../actions/Assets"

let activeAsset = null

const save = (content) => {
	if(activeAsset) {
		Assets.save(activeAsset, content)
	}
}

const handleWorkspaceLocal = (payload) => {
	if(activeAsset) {
		store.unwatch(`assets/${activeAsset.id}`, handleActive)
	}
	activeAsset = store.data.assets[payload.value]
	if(activeAsset) {
		store.watch(`assets/${activeAsset.id}`, handleActive)
		FileSystem.read(Assets.buildPath(activeAsset), handleLoadWorkspace)
	}
}

const handleActive = (payload) => {
	if(payload.action === "REMOVE") {
		store.set("local/workspace", null)
		store.set("workspace", null)
		activeAsset = null
	}
}

// TODO: Handle error case
const handleLoadWorkspace = (error, content) => {
	store.set("workspace", content)
}

store.set("workspace", null)
store.watch("local/workspace", handleWorkspaceLocal)

export {
	save
}