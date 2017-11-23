import { store } from "wabi"
import Assets from "../actions/Assets"
import Persistence from "../Persistence"

const dispatch = function(messages)
{
	if(messages instanceof Array) {
		for(let n = 0; n < messages.length; n++) {
			translate(messages[n])
		}
	}
	else {
		translate(messages)
	}

	Persistence.updateIo()
}

const translate = function(payload)
{
	const buffer = payload.key.split("/")
	switch(buffer[0])
	{
		case "assets":
		{
			switch(payload.action)
			{
				case "SET":
				{
					if(buffer.length === 1) {
						store.handle(payload)
					}
					else if(buffer.length === 2) {
						Assets.performAdd(payload)
					}
					else {
						if(payload.key.indexOf("assets//") === 0) {
							store.handle(payload)
						}	
						else {				
							Assets.performUpdate(payload, buffer)
						}
					}
				} break

				case "ADD":
				{
					Assets.performUpdate(payload, buffer)
				} break

				case "REMOVE": {
					if(buffer.length === 2) {
						Assets.performRemove(payload)
					}
					else if(buffer.length >= 4) {
						Assets.performUpdate(payload, buffer)
						break
					}
					store.handle(payload)
				} break

				case "MOVE":
					Assets.performMove(payload)
					break

				default:
					store.handle(payload)
					break
			}
		} break

		default:
			store.handle(payload)
			break
	}	
}

export default dispatch