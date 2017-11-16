
class History 
{
	constructor() {
		this.undos = []
		this.redos = []
	}

	clear() {
		this.undos.length = 0
		this.redos.length = 0
	}

	execute(cmd) {
		this.undos.push(cmd)
		this.redos.length = 0
		cmd.execute()
	}

	undo() {
		if(this.undos.length === 0) { return }
		const cmd = this.undos.pop()
		
		this.redos.push(cmd)
		cmd.undo()
	}

	redo() {
		if(this.redos.length === 0) { return }
		const cmd = this.redos.pop()

		this.undos.push(cmd)
		cmd.execute()
	}
}

const instance = new History()

export default instance