
const warn = function(type, message) {
	console.warn(`${type}: ${message}`)
}

const error = function(type, message) {
	console.error(`${type}: ${message}`)
}

export {
	warn,
	error
}
