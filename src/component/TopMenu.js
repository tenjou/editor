import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"

const TopMenu = component({
	render() {
		elementOpen("topmenu")
			elementOpen("logo")
				text("meta")
			elementClose("logo")
		elementClose("topmenu")
	}
})

export default TopMenu