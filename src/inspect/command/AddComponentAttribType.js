import Command from "~/Command"
import ComponentService from "../service/Component"

class AddComponentAttribType extends Command 
{
	execute(param) 
	{
		store.add(param.id, {
			id: Date.now(),
			name: param.name,
			type: param.type,
			value: ComponentService.createValue(param.type)
		})
	}
}

export default AddComponentAttribType