import { store } from "wabi"
import { saveAs } from "../../libs/FileSaver"
import { JSZip } from "../../libs/JSZip"
import fs from "../fs/FileSystem"

const exportZip = function() {
	const assets = store.get("assets")
	const id = store.get("settings.id")
	const zip = new JSZip()
	let count = Object.keys(assets).length + 1

	fs.read("db.json", (error, contents) => {
		zip.file("db.json", contents)
		count--
		if(count === 0) {
			finishZip(zip)
		}
	})

	for(const key in assets) {
		const asset = assets[key]
		const cut_location = asset.path.indexOf(id) + id.length + 1
		const local_path = asset.path.substr(cut_location)

		fs.readBlob(local_path, (error, contents) => {
			const name = asset.path.split("/").pop()
			zip.folder(asset.type.toLowerCase()).file(name, contents)
			count--
			if(count === 0) {
				finishZip(zip)
			}
		})
	}
}

const finishZip = function(zip) {
	zip.generateAsync({type:"blob"}).then(function (blob) {
		saveAs(blob, store.get("settings.name") + ".zip")
	})
}

export default {
	exportZip
}