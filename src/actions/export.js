import { store } from "wabi"
import { saveAs } from "../../libs/FileSaver"
import { JSZip } from "../../libs/JSZip"
import fs from "../fs/FileSystem"
import Assets from "../actions/Assets"

const exports = {
	defaultOptions: {
		type: "All", //All, JSON, Assets
		format: "Compressed" //Compressed, Uncompressed
	},
	All: (assets) => {
		return new Promise((resolve, reject) => {
			Promise.all([exports.JSON(assets), exports.Assets(assets)]).then((values) => {
				resolve(values[0].concat(values[1]))
			})
		})
	},
	JSON: (assets) => {
		return new Promise((resolve, reject) => {
			let processed_assets = Object.assign({}, assets)
			Object.keys(processed_assets).forEach((key) => {
				delete processed_assets[key]['cache']
			})
			delete processed_assets[""]
			resolve([{
				"name": "db.json",
				"contents": JSON.stringify(processed_assets, null, "\t"),
				"type": "string"
			}])
		})
	},
	Assets: (assets) => {
		return new Promise((resolve, reject) => {
			let contents = []
			for (var key in assets) {
				if(assets[key].ext != null) {
					contents.push(exports.GetContents(Assets.buildPath(assets[key])))
				}
			}

			Promise.all(contents).then((values) => {
				resolve(values)
			})
		})
	},
	GetContents: (path) => {
		return new Promise((resolve, reject) => {
			fs.readBlob(path, (error, contents) => {
				resolve({
					"name": contents.name,
					"contents": contents,
					"type": "blob"
				})
			})
		})
	},
	Compressed: (files) => {
		const zip = new JSZip()
		for (var i = 0; i < files.length; i++) {
			zip.file(files[i].name, files[i].contents)
		}
		zip.generateAsync({type:"blob"}).then(function (blob) {
			saveAs(blob, store.get("project/name") + ".zip")
		})
	},
	Uncompressed: (files) => {
		for (var i = 0; i < files.length; i++) {
			let blob = files[i].contents
			if(files[i].type === "string") {
				blob = new Blob([files[i].contents], {
					type: "text/plain"
				})
			}		
			saveAs(blob, files[i].name)
		}
	},
	Download: (options) => {
		options = Object.assign({}, exports.defaultOptions, options)
		return new Promise((resolve, reject) => {
			const assets = store.get("assets")
			exports[options.type](assets).then((files) => {
				exports[options.format](files)
				resolve()
			})
		})
	}
}

export default {
	exports
}