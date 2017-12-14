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

	if(def.extend) {
		let menu = extendMenu([], def.menu)
		const extendDef = menus[def.extend]
		if(extendDef) {
			menu = extendMenu(menu, extendDef.menu)
		}
		return menu
	}
	
	return def.menu || null
}

const extendMenu = (menu, extendMenu) => 
{
	const maxIndex = menu.length

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

export {
	set,
	get
}