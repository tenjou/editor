import Workspace from "./system/Workspace"

class Action {
	constructor(id, param) {
		this.id = id
		this.param = param
	}
}

const commands = {
	SaveWorkspace: {
		execute(command) {
			Workspace.save(command.param)
		}
	}
}

const execute = (id, param) => {
	const command = commands[id]
	if(!command) {
		console.warn(`(Commander.execute) No such command found: ${id}`)
		return
	}
	command.execute(new Action(id, param))
}

export {
	execute
}