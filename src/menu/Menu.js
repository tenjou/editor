import { cloneObj } from "../Utils"

const menus = {}

class MenuDef 
{
	constructor(menu, extend) {
		this.menu = menu
		this.extend = extend
	}
}

const set = (id, extend, menu) => 
{
	if(!menu) {
		menu = extend
		extend = null
	}

	if(extend) {
		menus[id] = new MenuDef(menu, extend)
	}
	else {
		menus[id] = new MenuDef(menu, extend)
	}
}

const get = (id) => 
{
	const def = menus[id]
	if(!def) {
		return null
	}

	let menu = def.menu

	if(def.extend) {
		menu = extend([], def)
	}
	if(menu) {
		sort(menu)
	}

	return menu || null
}

const extend = (menu, def) => 
{
	const menuExtends = def.extend
	if(menuExtends)
	{
		if(Array.isArray(menuExtends)) {
			for(let n = 0; n < menuExtends.length; n++) {
				const menuExtend = menuExtends[n]
				const defExtend = menus[menuExtend]
				if(!defExtend) {
					console.warn(`(Menu.extend) Menu not defined: ${menuExtend}`)
				}
				else {
					menu = extend(menu, defExtend)
				}
			}
		}
		else {
			const defExtend = menus[menuExtends]
			if(!defExtend) {
				console.warn(`(Menu.extend) Menu not defined: ${menuExtends}`)
			}
			else {
				menu = extend(menu, defExtend)
			}		
		}
	}

	const maxIndex = menu.length
	const extendMenu = def.menu

	for(let n = 0; n < extendMenu.length; n++) 
	{
		const extendItem = extendMenu[n]
		let found = false

		for(let i = 0; i < maxIndex; i++) {
			const item = menu[n]
			if(item.name === extendItem.name) {
				const newItem = Object.assign({}, extendItem)
				if(item.children) {
					newItem.children = item.children.concat(extendItem.children)
					
				}
				menu[n] = newItem
				found = true
				break
			}
		}

		if(!found) {
			menu.push(extendItem)
		}
	}

	return menu
}

const sort = (menu) =>
{
	menu.sort(sortByIndex)
	
	for(let n = 0; n < menu.length; n++) {
		const item = menu[n]
		if(item.children && Array.isArray(item.children)) {
			sort(item.children)
		}
	}	
}

const sortByIndex = (a, b) => 
{
	if(a.index === undefined) {
		return b.index
	}
	if(b.index === undefined) {
		return a.index
	}

	return b.index - a.index
}

export {
	set,
	get
}