import {
	component,
	componentVoid,
	elementOpen,
	elementClose,
	elementVoid,
	store
} from "wabi"

export default component({
	render() 
	{
		let cls;

		if(this.$value) 
		{
			let icon = store.get(`types.${this.$value}.icon`);
			if(!icon) {
				cls = "fa fa-question";
			}
			else {
				cls = "fa " + icon;
			}
		}
		else {
			cls = "fa fa-question";
		}

		elementVoid("icon", { class: cls })
	}
})