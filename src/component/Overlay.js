import { component, elementOpen, elementClose, store } from "wabi"

store.set("overlay", [])

const Overlay = component
({
	mount() {
		this.bind = "overlay"
	},

	render() {
		elementOpen("overlay")
			const funcs = this.$value
			for(let n = 0; n < funcs.length; n++) {
				funcs[n]()
			}
		elementClose("overlay")
	}
})

export default Overlay