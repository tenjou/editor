import { store } from "wabi"
import { saveAs } from "../../libs/FileSaver"
import { JSZip } from "../../libs/JSZip"
import fs from "../fs/FileSystem"
import Assets from "../actions/Assets"
import { cloneObj } from "~/Utils"

class Exports {
	constructor(options) {
		this._defaultOptions = {
			type: "Production", //Production, Development, JSON, Assets
			format: "Compressed" //Compressed, Uncompressed
		}
		this.options = Object.assign({}, this.defaultOptions, options)
		this.assets = store.get("assets")
		this.id = store.get("project/id")
	}

	download() {
		return new Promise((resolve, reject) => {
			this[this.options.type.toLowerCase()]().then((files) => {
				this[this.options.format.toLowerCase()](files)
				resolve()
			})
		})
	}

	compressed(files) {
		const zip = new JSZip()
		for (var i = 0; i < files.length; i++) {
			if(files[i].path) {
				zip.folder(files[i].path).file(files[i].name, files[i].contents)
			} else {
				zip.file(files[i].name, files[i].contents)
			}
		}
		zip.generateAsync({type:"blob"}).then(function (blob) {
			saveAs(blob, store.get("project/name") + ".zip")
		})
	}

	uncompressed(files) {
		for (var i = 0; i < files.length; i++) {
			let blob = files[i].contents
			if(files[i].type === "string") {
				blob = new Blob([files[i].contents], {
					type: "text/plain"
				})
			}		
			saveAs(blob, files[i].name)
		}
	}

	production() {
		return new Promise((resolve, reject) => {
			Promise.all([this.json(), this.files()]).then((values) => {
				resolve(values[0].concat(values[1]))
			})
		})
	}

	development() {
		return new Promise((resolve, reject) => {
			this.scanProject("").then((results) => {
				let contents = []
				results.forEach((result) => {
					contents.push(this.getContents(result.fullPath.replace("/" + this.id, "")))
				})

				Promise.all(contents).then((values) => {
					resolve(values)
				})
			})
		})
	}

	json() {
		return new Promise((resolve, reject) => {
			let processed_assets = cloneObj(this.assets)
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
	}

	files() {
		return new Promise((resolve, reject) => {
			let contents = []
			for (var key in this.assets) {
				if(this.assets[key].ext != null) {
					contents.push(this.getContents(Assets.buildPath(this.assets[key])))
				}
			}

			Promise.all(contents).then((values) => {
				resolve(values)
			})
		})
	}

	getContents(path) {
		return new Promise((resolve, reject) => {
			fs.readBlob(path, (error, contents) => {
				resolve({
					"name": contents.name,
					"contents": contents,
					"type": "blob",
					"path": path.replace(/^\//, '').substr(0, path.lastIndexOf("/"))
				})
			})
		})
	}

	getFilesInDirectory(path) {
		return new Promise((resolve, reject) => {
			fs.readDirectory(path, function(err, results) {
				resolve(results)
			})
		})
	}

	scanProject(path) {
		return new Promise((resolve, reject) => {
			this.getFilesInDirectory(path).then((list) => {
				return Promise.all(list.map((file) => {
					if(file.isDirectory) {
						return this.scanProject(file.fullPath.replace("/" + this.id, ""))
					} else {
						return file
					}
				}))
			}).then((results) => {
				resolve(Array.prototype.concat.apply([], results))
			})
		})
	}

}

export default {
	Exports
}