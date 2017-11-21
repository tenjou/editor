import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import OverlayView from "./OverlayView"
import Projects from "../component/Projects"

const HomeView = component
({
	render() {
		elementOpen("layout")
			elementOpen("content", { class: "centered" })
				componentVoid(Projects, { bind: "projects" })
			elementClose("content")
		elementClose("layout")

		componentVoid(OverlayView)	
	}
})

export default HomeView