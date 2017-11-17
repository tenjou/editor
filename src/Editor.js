import History from "./History"

class Editor
{
	constructor() {
		this.selected = null
	}

	execute(cmd) {
		History.execute(cmd)
	}

	selectById(id) 
	{
		const item = store.get(`assets/${id}`)
		if(this.selected === item) { return }

		if(this.selected) {
			store.set(`assets/${this.selected.id}/local/selected`, false)
		}

		this.selected = item

		if(this.selected) {
			store.set(`assets/${this.selected.id}/local/selected`, true)
		}
	}
}

const instance = new Editor()

export default instance