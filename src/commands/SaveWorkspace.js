import Command from "~/Command"
import Workspace from "~/system/Workspace"

class SaveWorkspace extends Command {
	execute() {
		Workspace.save(this.param)
	}
}

export default SaveWorkspace