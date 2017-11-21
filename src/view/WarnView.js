import { component, componentVoid, elementOpen, elementClose, elementVoid, text } from "wabi"

const WarnView = component
({
	render() {
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

export default WarnView