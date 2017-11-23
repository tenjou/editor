import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid
} from "wabi"

import ContextMenu from "./ContextMenu"

export default component(
{
	render() 
	{
		elementOpen("overlay")
			componentVoid(ContextMenu, { bind: "contextmenu" })
		elementClose("overlay")
	}
})
