import Command from "~/Command"
import Workspace from "~/system/Workspace"

class SaveWorkspace extends Command {
	execute(param) {
		Workspace.save(param)
	}
}

export default SaveWorkspace