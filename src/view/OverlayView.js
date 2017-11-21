import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import ContextMenu from "../component/ContextMenu"

const OverlayView = component({
	render() {
		elementOpen("overlay")
			componentVoid(ContextMenu)
		elementClose("overlay")		
	}
})

export default OverlayView