import editor from "./editor"

export default function main()
{
	window.addEventListener("dragover", (event) => event.preventDefault())
	window.addEventListener("drop", (event) => event.preventDefault())
    
    editor.setup()

// var createItem = ({
//    name = "test",
//    date = Date.now()  
// }) => ({
//   name,
//   date
// })
// createItem({ name: "tenjou" })	
// console.log(createItem)
}

// import { store } from "wabi"

// export default function main() 
// {
// 	store.watch("local", (payload) => {
// 		console.log("--")
// 		console.log("local:", payload.value)
// 	})
// 	store.watch("local/buffer", (payload) => {
// 		console.log("local/data/buffer:", payload.value)
// 	})	
// 	store.watch("local/selected", (payload) => {
// 		console.log("local/selected updated:", payload.value)
// 	})
// 	store.watch("local/stuff", (payload) => {
// 		console.log("local/stuff updated:", payload.value)
// 	})	
// 	store.watch("local/data/pos", (payload) => {
// 		console.log("local/data/pos updated:", payload.value)
// 	})

// 	// store.set("local", {})
// 	// store.set("local/buffer", [ "x" ])
// 	// store.add("local/buffer", "yyy")
// 	// store.remove("local/buffer")

// 	store.set("", {
// 		local: {
// 			selected: "assets/image.png",
// 			data: {
// 				pos: {
// 					x: 0, y: 10, z: 20
// 				}
// 			}
// 		}
// 	})
// 	store.set("local", {

// 			stuff: "works!",
// 			// selected: "xxx",
// 			data: {
// 				pos: {
// 					x: 0, y: 10, z: 20
// 				}
// 			}		
// 	})
// 	store.set("local", {})
// 	store.set("local/selected", "stuff")

// 	store.set("local", true)
// 	store.set("", {})

// 	store.set("local", {
// 		selected: "assets/image.png",
// 		data: {
// 			pos: {
// 				x: 0, y: 10, z: 20
// 			}
// 		}
// 	})
// 	store.set("local", {
// 		selected: "xxx",
// 		data: null
// 	})
// }


// import {
// 	component,
// 	componentVoid,
// 	elementOpen,
// 	elementClose,
// 	elementVoid,
// 	route,
// 	text
// } from "wabi"

// const Comp = component({
// 	state: {
// 		value: 0
// 	},
// 	render() 
// 	{
// 		if(this.$value === 0) {

// 		}
// 		else {
// 			elementOpen("div")
// 				text("item_comp_2: "+this.$value)
// 			elementClose("div")			
// 		}
// 	}
// })

// const Layout = component({
// 	state: {
// 		value: 0
// 	},
// 	render() 
// 	{
// 		elementOpen("div", { style: { padding: "10px" }, onclick: this.next.bind(this) })

// 		if(this.$value === 0) {
// 			componentVoid(Warn)
// 		}
// 		else
// 		{
// 				elementOpen("div")
// 					text("item_1")
// 				elementClose("div")

// 				if(this.$value === 1) {
// 					componentVoid(Comp)
// 				}
// 				else if(this.$value === 2) {
// 					componentVoid(Comp, { $value: 1 })
// 				}			
// 				else {
// 					elementOpen("div")
// 						text("item_2")
// 					elementClose("div")					
// 				}

// 				elementOpen("div")
// 					text("item_3")
// 				elementClose("div")	
			
// 		}

// 		elementClose("div")
// 	},
// 	next() {
// 		this.$value++
// 	}
// })

// const Warn = component(
// {
// 	render() 
// 	{
// 		elementOpen("layout")
// 			elementOpen("content", { class: "centered" })
// 				elementOpen("warn")
// 					elementVoid("icon", { class: "fa fa-exclamation-triangle" })
// 					elementOpen("span")
// 						text("Editor requires local storage access for storing project data.")
// 					elementClose("span")
// 				elementClose("warn")
// 			elementClose("content")
// 		elementClose("layout")
// 	}
// })


// export default function main() {
// 	route("", Layout)
// }
