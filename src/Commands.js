

const execute = (commandCls, param) => {
	const command = new commandCls()
	command.execute(param)
}

export {
	execute
}