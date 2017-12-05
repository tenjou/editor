import { component, componentVoid, elementOpen, elementClose, elementVoid, text, store } from "wabi"
import FileSystem from "../fs/FileSystem"
import Assets from "../actions/Assets"

const Image = component
({
	state: {
		value: null,
		updated: 0
	}, 

	render() {
		const path = Assets.buildPath(this.$.value)
		elementOpen("image")
			elementVoid("img", { src: `${FileSystem.fullPath}${path}?${this.$updated}` })
		elementClose("image")
	}
})

export default Image