import Definitions from "./Definitions"

Definitions.add("Inspect.Default", {
	General: {
		type: "Group",
		index: 1,
		children: {
            Id: {
                type: "String",
                bind: "meta/id",
                readonly: true
            },
			Name: {
				type: "String",
				bind: "meta/name"
			}
		}
	}
})