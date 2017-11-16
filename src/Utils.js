
const isEmpty = function(obj)
{
	for(let key in obj) {
		if(obj[key]) {
			return false
		}
	}

	return true
}

const dataURItoBlob = function(dataURI, type)
{
	const binary = atob(dataURI.split(",")[1])
	const length = binary.length
	const array = new Uint8Array(length)

	for(let n = 0; n < length; n++) {
		array[n] = binary.charCodeAt(n)
	}

	return new Blob([ array ], { type: type })
}

const cloneObj = function(obj)
{
	const result = {}

	for(let key in obj) 
	{
		const value = obj[key]
		if(typeof obj[key] === "object" && value) 
		{
			// TODO: Possibly loop through array and check if there are objects to clone?
			if(value instanceof Array) {
				result[key] = value.slice(0)
			}
			else {
				result[key] = cloneObj(value)
			}
		}
		else {
			result[key] = value
		}
	}

	return result
}

const rngBuffer = new Uint8Array(16)
const tempResult = new Array(16)
const byteToHex = new Array(256)
for(let n = 0; n < 256; n++) {
	byteToHex[n] = (n + 0x100).toString(16).substr(1)
}

const uuid4 = () => {
	crypto.getRandomValues(rngBuffer)
	rngBuffer[6] = (rngBuffer[6] & 0x0f) | 0x40
	rngBuffer[8] = (rngBuffer[8] & 0x3f) | 0x80	
	for(let n = 0; n < 16; n++) {
		tempResult[n] = byteToHex[rngBuffer[n]]
	}
	return tempResult.join("")
}

export {
	isEmpty,
	dataURItoBlob,
	cloneObj,
	uuid4
}
