import History from "./History"

class Editor
{
	constructor() {

	}

	execute(cmd) {
		History.execute(cmd)
	}
}

const instance = new Editor()

export default instance