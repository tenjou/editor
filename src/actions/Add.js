import Commands from "../Commands"
import Editor from "../Editor"
import { uuid4 } from "../Utils"

const folder = () => {
	const data = {
		id: uuid4(),
		type: "Folder",
		name: "Folder",
		local: {}
	}
	Editor.execute(new Commands.AddItem(data))
}

export {
	folder
}