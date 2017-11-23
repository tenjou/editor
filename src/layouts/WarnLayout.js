import {
	component,
	elementOpen,
	elementClose,
	elementVoid,
	text
} from "wabi"

export default component(
{
	render() 
	{
		elementOpen("layout")
			elementOpen("content", { class: "centered" })
				elementOpen("warn")
					elementVoid("icon", { class: "fa fa-exclamation-triangle" })
					elementOpen("span")
						text("Editor requires local storage access for storing project data.")
					elementClose("span")
				elementClose("warn")
			elementClose("content")
		elementClose("layout")
	}
})
