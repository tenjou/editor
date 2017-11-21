import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import OverlayView from "./OverlayView"
import TopMenu from "../component/TopMenu"
import Hierarchy from "../component/Hierarchy"
import Workspace from "../component/Workspace"
import Inspect from "../component/Inspect"

const MainView = component
({
	render() {
		elementOpen("layout", this.attr)
			componentVoid(TopMenu)

			elementOpen("row")
				componentVoid(Hierarchy, { bind: "hierarchy" })
				componentVoid(Workspace)
				componentVoid(Inspect, { bind: "" })
			elementClose("row")
		elementClose("layout")

		componentVoid(OverlayView)
	}
})

export default MainView