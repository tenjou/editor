import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid,
	store
} from "wabi"

export default component(
{
	mount() {
		this.attrPointerFunc = () => store.set(this.bind, null)
		this.attrTranslateFunc = () => store.set(this.bind, "translate")
		this.attrRotateFunc = () => store.set(this.bind, "rotate")
		this.attrScaleFunc = () => store.set(this.bind, "scale")
	},

	render() 
	{
		const transform = this.$.value ? this.$.value : null

		const attrPointer = {
			class: (!transform || transform === "pointer") ? "fa fa-mouse-pointer selected" : "fa fa-mouse-pointer",
			onclick: this.attrPointerFunc
		}
		const attrTranslate = {
			class: (transform === "translate") ? "fa fa-arrows selected" : "fa fa-arrows",
			onclick: this.attrTranslateFunc
		}
		const attrRotate = {
			class: (transform === "rotate") ? "fa fa-repeat selected" : "fa fa-repeat",
			onclick: this.attrRotateFunc
		}
		const attrScale = {
			class: (transform === "scale") ? "fa fa-expand selected" : "fa fa-expand",
			onclick: this.attrScaleFunc
		}

		elementOpen("scene-tools")
			elementOpen("panel")
				elementVoid("item", attrPointer)
				elementVoid("item", attrTranslate)
				elementVoid("item", attrRotate)
				elementVoid("item", attrScale)
			elementClose("panel")
		elementClose("scene-tools")
	}
})
