import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid
} from "wabi"

import Navbar from "../components/Navbar"
import Projects from "../components/Projects"
import Overlay from "../components/Overlay"

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
