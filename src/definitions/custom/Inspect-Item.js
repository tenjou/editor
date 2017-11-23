import Definitions from "../Definitions"

Definitions.add("Inspect.Item", "Inspect.Default", {
	Item: {
		type: "Group",
		children: {
			Value: {
				type: "Number",
				bind: "data/value",
				default: 0,
				min: 0
			}
		}
	}
})

		// name: "Apple",
		// type: "HealingItem",
		// icon: "Apple",
		// sell: 7,
		// weight: 2,

	// 		General: {
	// 	type: "Group",
	// 	index: 1,
	// 	children: {
    //         Id: {
    //             type: "String",
    //             bind: "meta/id",
    //             readonly: true
    //         },
	// 		Name: {
	// 			type: "String",
	// 			bind: "meta/name"
	// 		}
	// 	}
	// }