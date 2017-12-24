import Command from "~/Command"
import ComponentService from "../service/Component"

class SetComponentAttribType extends Command 
{
	execute(param) {
		store.set(`${param.id}/value`, ComponentService.createValue(param.type))
	}
}

export default SetComponentAttribType