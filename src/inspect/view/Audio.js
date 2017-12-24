import {
	component,
	elementOpen,
	elementClose,
	elementVoid,
} from "wabi"

import FileSystem from "~/fs/FileSystem"

export default component(
{
	state: {
		updated: 0
	}, 

	render() {
		elementVoid("audio", { controls: "", src: `${FileSystem.fullPath}${this.$value}?${this.$updated}` })
	}
})
