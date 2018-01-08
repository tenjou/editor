
const watchers = {}

const execute = (ctor, props) => 
{
	const command = new ctor()
	command.execute(props)

	const buffer = watchers[ctor.name]
	if(buffer) {
		for(let n = 0; n < buffer.length; n++) {
			buffer[n](props)
		}
	}
}

const on = (ctor, func) => 
{
	const buffer = watchers[ctor.name]
	if(buffer) {
		buffer.push(func)
	}
	else {
		watchers[ctor.name] = [ func ]
	}
}

const off = (ctor, func) => 
{
	const buffer = watchers[ctor.name]
	if(!buffer) { return }

	const index = buffer.indexOf(func)
	if(index === -1) { return }

	buffer[index] = buffer[buffer.length - 1]
	buffer.pop()
}

export {
	execute,
	on,
	off
}