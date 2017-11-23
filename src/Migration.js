import Persistence from "./Persistence"

// Persistence.storage("assets").seed(null, {
// 	name: "Project",
// 	children: {},
// 	local: {
// 		open: true,
// 		selectedDirectory: true
// 	}
// })

Persistence.storage("local").seed("assets", {
	location: "",
	search: null
})
