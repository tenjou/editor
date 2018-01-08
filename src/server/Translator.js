import { store } from "wabi"
import Assets from "../actions/Assets"
import Persistence from "../Persistence"
import Cmder from "~/Cmder"
import AddAssetCommand from "~/assets/commands/AddAssetCommand"
import RemoveAssetCommand from "~/assets/commands/RemoveAssetCommand"
import UpdateAssetCommand from "~/assets/commands/UpdateAssetCommand"

const watchers = {}

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
						Cmder.execute(AddAssetCommand, payload.value)
					}
					else {
						if(payload.key.indexOf("assets//") === 0) {
							store.handle(payload)
						}	
						else {		
							Cmder.execute(UpdateAssetCommand, {
								asset: store.data.assets[buffer[1]], 
								key: buffer.slice(2), 
								value: payload.value
							})		
							Assets.performUpdate(payload, buffer)
						}
					}
				} break

				case "ADD":
				{
					Cmder.execute(UpdateAssetCommand, {
						asset: store.data.assets[buffer[1]], 
						key: buffer.slice(2), 
						value: payload.value
					})
					Assets.performUpdate(payload, buffer)
				} break

				case "REMOVE": {
					if(buffer.length === 2) {
						Cmder.execute(RemoveAssetCommand, payload.value ? payload.value : store.get(payload.key))
						Assets.performRemove(payload)
					}
					else if(buffer.length >= 4) {
						Cmder.execute(UpdateAssetCommand, {
							asset: store.data.assets[buffer[1]], 
							key: buffer.slice(2), 
							value: payload.value
						})
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

const watch = (event, func) => 
{
	const buffer = watchers[event]
	if(buffer) {
		buffer.push(func)
	}
	else {
		watchers[event] = [ func ]
	}
}

const unwatch = (event, func) => 
{
	const buffer = watchers[event]
	if(!buffer) { return }

	const index = buffer.indexOf(func)
	if(index === -1) { return }

	buffer[index] = buffer[buffer.length - 1]
	buffer.pop()
}

const emit = (event, arg1, arg2, arg3) => 
{
	const buffer = watchers[event]
	if(!buffer) { return }

	for(let n = 0; n < buffer.length; n++) {
		buffer[n](arg1, arg2, arg3)
	}
}

export {
	dispatch,
	watch,
	unwatch,
	emit
}