import Definitions from "./Definitions"

Definitions.add("Inspect.Audio", "Inspect.Default", {
	Preview: {
		type: "Group",
		children: {
			Audio: {
				type: "Audio",
				bind: "path"
			}
		}
	}		
})