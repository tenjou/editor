import { component, componentVoid, elementOpen, elementClose, elementVoid, text, store } from "wabi"
import FileSystem from "../fs/FileSystem"
import Assets from "../actions/Assets"

const Image = component
({
	state: {
		value: null,
		updated: 0
	}, 

	mount() {
		this.attr = {
			ondrop: (event) => {
				const id = event.dataTransfer.types[0]
				this.$value = store.get(`assets/${id}`)
			},
			ondragover(event) {
				console.log("drag-over")
			},
			ondragenter(event) {
				console.log("drag-enter")
			},
			ondragleave(event) {
				console.log("drag-leave")
			}
		}
	},

	render() {
		const path = Assets.buildPath(this.$.value)
		elementOpen("image", this.attr)
			if(path) {
				elementVoid("img", { src: `${FileSystem.fullPath}${path}?${this.$updated}` })
			}
		elementClose("image")
	}
})

export default Image