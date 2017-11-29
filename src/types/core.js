import Types from "../actions/Types"
import { uuid4 } from "../Utils"

Types.add("General", {
	icon: "fa-question",
	data: {
		id: null,
		type: null,
		name: null,
		parent: null,
		created: 0,
		updated: 0,
		cache: {
			selected: false
		}
	},
	init() {
		const timestep = Date.now()
		this.id = uuid4()
		this.created = timestep
		this.updated = timestep
	},
	schema: [
		{
			name: "id",
			type: "String",
			bind: "id",
			readonly: true
		},
		{
			name: "name",
			type: "String",
			bind: "name"
		}
	]
})

Types.add("Folder", "General", {
	icon: "fa-folder",
	init() {
		this.cache.selectedDirectory = false
		this.cache.open = true
	},
	open() {
		store.set("local/assets/location", this.id)
	}
})

Types.add("File", "General", {
	icon: "fa-file",
	init() {
		this.ext = null
	}
})

Types.add("Texture", "File", {
	icon: "fa-picture-o",
	exts: {
		png: "image/png",
		jpg: "image/jpeg",
		jpeg: "image/jpeg",
		bmp: "image/bmp"
	},
	schema: [
		{
			name: "texture",
			type: "Image"
		}
	]	
})

Types.add("Audio", "File", {
	icon: "fa-volume-off",
	exts: {
		mp3: "audio/mpeg",
		ogg: "audio/ogg",
		wav: "audio/wav"
	}
})

Types.add("Video", "File", {
	icon: "fa-video-camera",
	exts: {
		m4v: "video/mp4",
		mp4: "video/mp4"
	}
})

Types.add("Text", "File", {
	icon: "fa-font",
	exts: {
		txt: "text/plain"
	}	
})

Types.add("Template", "File", {
	icon: "fa-cube"
})

Types.add("Enum", "File", {
	icon: "fa-list",
	init() {
		this.data = []
	},
	schema: [
		{
			name: "enum",
			type: "Enum",
			bind: "data"
		}
	]	
})

Types.add("Entity", "File", {
	icon: "fa-cube",
	init() {
		this.components = []
	},
	schema: [
		{
			name: "entity",
			type: "Entity",
			bind: "components"
		}
	]
})

Types.add("Component", "File", {
	icon: "fa-flask",
	init() {
		this.attribs = []
		this.attribsEdited = []
	},
	schema: [
		{
			name: "component",
			type: "Component",
			bind: ""
		}
	]
})
