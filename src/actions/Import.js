import { JSZip } from "../../libs/JSZip"
import fs from "../fs/FileSystem"
import Project from "./Project"

const importZip = function(files) {

	if(files.length > 0) {
		Project.create(function(data) {
			const id = data.id
			const zip = new JSZip()

			zip.loadAsync(files[0]).then(function(z) {
				const file_count = Object.keys(zip.files).length
				let buffer = []
				let counter = 0

				zip.forEach(function (relative_path, file) {
					console.log("Importing...", relative_path)

					if(relative_path === "db.json") {
						file.async("string").then(function(content) {
							const processed_json = processDBJSON(data, content)
							fs.write(`${id}/db.json`, processed_json, function(error, file_entry) {
								Project.fetch()
								counter++
								progress(counter, file_count, buffer)
							})
						})
					} else {
						file.async("arraybuffer").then(function(content) {
							buffer.push({
								id: id,
								relative_path: relative_path,
								content: content,
								is_dir: file.dir
							})
							counter++
							progress(counter, file_count, buffer)
						})
					}
				})
			})
		})
	}
}

const processDBJSON = function(create_data, data) {
	const json = JSON.parse(data)
	const old_id = json.settings.id

	json.settings.id = create_data.id
	json.settings.created = create_data.created

	for(const key in json.assets) {
		json.assets[key].path = json.assets[key].path.replace(old_id, create_data.id)
 	}

	return JSON.stringify(json)
}

const progress = function(counter, total, buffer) {
	if(counter == total) {
		saveFiles(buffer)
	}
}

const saveFiles = function(buffer) {
	if(buffer.length == 0) {
		console.log("Import complete.")
		return
	}

	const file = buffer.shift()

	console.log("saving...", file.relative_path)
	if(file.is_dir) {
		fs.createDirectory(file.id + "/" + file.relative_path, function(error, uri) {
			saveFiles(buffer)
		})
	} else {
		const ext = file.relative_path.split(".").pop()
		const data = System.populateData({})
		let mime = "";

		for(let typeKey in data.types) 
		{
			const type = data.types[typeKey]
			const exts = type.exts
			for(let extKey in exts)
			{
				if(extKey === ext.toLowerCase()) {
					mime = exts[extKey]
				}
			}
		}
		if(mime == "") {
			mime = "text/plain"
		}
		console.log(mime)

		const blob = new Blob([file.content], { type: mime })
		
		fs.writeBlob(file.id + "/" + file.relative_path, blob, function(error, uri) {
			console.log(error)
			saveFiles(buffer)
		})
	}
}

export default {
	importZip
}