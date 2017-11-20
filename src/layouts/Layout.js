import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"
import TopMenu from "../component/TopMenu"
import Hierarchy from "../component/Hierarchy"
import Workspace from "../component/Workspace"
import Inspect from "../component/Inspect"
import ContextMenu from "../component/ContextMenu"

const Layout = component
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

		elementOpen("overlay")
			componentVoid(ContextMenu)
		elementClose("overlay")		
	}
})

export default Layout