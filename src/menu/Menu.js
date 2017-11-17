
const menus = {}

const add = (id, extend, props) => 
{
	if(!props) {
		props = extend
		extend = null
	}

	if(extend) {
		const parentMenu = menus[extend]
		if(!parentMenu) {
			console.warn(`(Menu.add) Could not find menu: ${extend}`)
			return
		}
		const menu = parentMenu.concat(props)
		menus[id] = menu
	}
	else {
		menus[id] = props
	}
}

const get = (id) => {
	return menus[id] || null
} 

export { 
	add,
	get
}