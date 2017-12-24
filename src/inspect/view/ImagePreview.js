import { component, componentVoid, elementOpen, elementClose, elementVoid, text, store } from "wabi"
import FileSystem from "~/fs/FileSystem"
import Assets from "~/actions/Assets"
import Drop from "./Drop"

const ImagePreview = component
({
	state: {
		value: null,
		updated: 0,
		dragOver: false
	}, 

	mount() 
	{
		this.attr = {
			ondrop: (event) => {
				this.$value = event.dataTransfer.types[0]
				this.$dragOver = false
				if(this.$value) {
					this.bind.updated = `assets/${this.$value}/updated`
				}
			},
			ondragover: (event) => {
				this.$dragOver = true
			},
			ondragleave: (event) => {
				this.$dragOver = false
			}		
		}

		this.attrRemove = {
			onclick: (event) => {
				this.$value = null
				this.bind.updated = null
			}
		}
	},

	render() 
	{
		const asset = store.get(`assets/${this.$value}`)
		const path = Assets.buildPath(asset)
		const attr = this.$dragOver ? Object.assign({ class: "hover" }, this.attr) : this.attr

		componentVoid(Drop, {
			$type: "Texture",
			bind: {
				value: this.bind.value
			}
		})

		elementOpen("image", attr)
			if(path) {
				elementOpen("button", this.attrRemove)
					elementVoid("icon", { class: "fa fa-remove" })
				elementClose("button")
				elementVoid("img", { src: `${FileSystem.fullPath}${path}?${this.$updated}` })
			}
		elementClose("image")
	}
})

export default ImagePreview