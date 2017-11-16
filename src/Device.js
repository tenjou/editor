
const context = {
	isMAC: false
}

const checkMAC = () => {
	return navigator.platform.toUpperCase().indexOf("MAC") >= 0
}

checkMAC()

export default context