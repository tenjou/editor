import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid,
	text,
	store
} from "wabi"

import Status from "../actions/Status"

const attrIconError = { class: "fa fa-exclamation-circle red" }
const attrIconWarn = { class: "fa fa-exclamation-triangle yellow" }

export default component({
	render() 
	{
		const messages = this.$.value

		elementOpen("status")
			if(messages.length > 0) {
				const message = messages[messages.length - 1]
				switch(message.level) {
					case Status.ERROR:
						elementVoid("icon", attrIconError)
						break
					case Status.WARN:
						elementVoid("icon", attrIconWarn)
						break
				}
				text(message.text)
			}
		elementClose("status")
	}
})
