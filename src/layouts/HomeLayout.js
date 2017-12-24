import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid
} from "wabi"

import Navbar from "../component/Navbar"
import Projects from "../component/Projects"
import Overlay from "../component/Overlay"

export default component(
{
	render() 
	{
		elementOpen("layout")
			elementOpen("content", { class: "centered" })
				componentVoid(Projects, { bind: "projects" })
			elementClose("content")
		elementClose("layout")

		componentVoid(Overlay)
	}
})
