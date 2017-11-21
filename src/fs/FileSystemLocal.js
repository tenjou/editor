
let fs = null
let rootDir = ""

const init = function(onDone, onError) {
	fs = require("fs")
	if(onDone) {
		onDone()
	}
}

const create = function(filename, onDone)
{
	const path = rootDir + filename

	fs.writeFile(path, "",
		(error) => {
			if(error) {
				handleError("create", error, onDone);
				return
			}

			if(onDone) {
				onDone(null, path)
			}
		})
}

const read = function(filename, onDone)
{
	const path = rootDir + filename

	fs.readFile(path,
		function(error, data)
		{
			if(error)
			{
				if(onDone) {
					onDone(error, null)
				}
				return
			}

			if(onDone) {
				onDone(null, data.toString())
			}
		})
}

const write = function(filename, content, onDone)
{
	const path = rootDir + filename

	fs.writeFile(path, content,
		(error) => {
			if(error) {
				handleError("write", error, onDone)
				return
			}

			if(onDone) {
				onDone(null, content)
			}
		})
}

const writeBlob = function(filename, blob, onDone)
{
	const path = rootDir + filename

	const fileReader = new FileReader()
	fileReader.onload = function() {
		const arrayBuffer = this.result
		const uint8Array = new Uint8Array(arrayBuffer)

		fs.writeFile(path, uint8Array,
			(error) => {
				if(error) {
					handleError("write", error, onDone)
					return
				}

				if(onDone) {
					onDone(null, path)
				}
			})
	}
	fileReader.readAsArrayBuffer(blob)
}

const writeBase64 = function(filename, base64, onDone)
{
	const path = rootDir + filename

	const index = base64.indexOf(",")
	let base64Data = base64.slice(index)
	base64Data += base64Data.replace("+", " ")
	const binaryData = new Buffer(base64Data, "base64").toString("binary")

	fs.writeFile(path, binaryData, "binary",
		(error) => {
			if(error) {
				handleError("write64", error, onDone)
				return
			}

			if(onDone) {
				onDone(null, path)
			}
		})
}

const remove = function(filename, onDone)
{
	const path = rootDir + filename

	fs.unlink(path,
		(error) => {
			if(error) {
				handleError("remove", error, onDone)
				return
			}

			if(onDone) {
				onDone(null, path)
			}
		})
}

const moveTo = function(filename, targetPath, onDone)
{
	const path = rootDir + filename

	fs.rename(path, this.rootDir + targetPath,
		(error) => {
			if(error) {
				handleError("moveTo", error, onDone)
				return
			}

			if(onDone) {
				onDone(null, path)
			}
		})
}

const checkDirectory = function(filename, onDone)
{
	const path = rootDir + filename

	fs.exists(path,
		(exists) => {
			if(!exists) {
				handleError("checkDirectory", error, onDone)
				return
			}

			if(onDone) {
				onDone(null, path)
			}
		})
}

const readDirectory = function(filename, onDone)
{
	const path = rootDir + filename

	fs.readdir(path,
		(error, files) => {
			if(error) {
				handleError("readDirectory", error, onDone)
				return
			}

			if(onDone) {
				onDone(null, files)
			}
		})
}

const createDirectory = function(filename, onDone)
{
	const path = rootDir + filename

	fs.exists(path,
		(error) => {
			if(error) {
				handleError("createDirectory", "There is already folder with in: " + path, onDone)
				return
			}

			fs.mkdir(path,
				(error) => {
					if(error) {
						handleError("createDirectory", error, onDone)
						return
					}

					if(onDone) {
						onDone(null, path)
					}
				})
		})
}

const createDirectories = function(dirs, onDone)
{
	const path = rootDir + dirs
	const exists = fs.existsSync(path)

	if(exists) {
		onDone(null)
	}
	else 
	{
		const buffer = dirs.split("/")
		const num = buffer.length
		let index = 0
		let path = buffer[index]

		createDirectoriesFunc(rootDir, index, buffer, onDone)
	}
}

const createDirectoriesFunc = function(path, index, buffer, onDone)
{
	if(index === buffer.length) {
		onDone(null)
	}
	else 
	{
		path += buffer[index] + "/"

		const exists = fs.existsSync(path)

		if(exists) {
			index++
			createDirectoriesFunc(path, index, buffer, onDone)
		}
		else 
		{
			if(fs.mkdirSync(path)) {
				handleError(fileError, onDone, "createDirecotries", name)
				return
			}

			index++
			createDirectoriesFunc(path, index, buffer, onDone)
		}		
	}	
}

const removeDirectory = function(filename, onDone)
{
	const path = rootDir + filename

	fs.readdir(path,
		(error, files) => {
			if(error) {
				handleError("removeDirectory", error, onDone)
				return
			}

			const wait = files.length
			let count = 0

			const folderDone = function(error)
			{
				count++
				if(count >= wait || error)
				{
					fs.rmdir(path,
						(error) => {
							if(error) {
								handleError("removeDir", error, onDone)
								return
							}

							if(onDone) {
								onDone(null, path)
							}
						})
				}
			}

			if(!wait) {
				folderDone(null)
				return
			}

			const newPath = path.replace(/\/+$/,"")
			files.forEach(
				(file) => {
					const filePath = rootDir + newPath + "/" + file
					fs.lstat(filePath,
						(error, stats) => {
							if(error) {
								handleError("removeDir", error, onDone)
								return
							}

							if(stats.isDirectory()) {
								removeDir(currPath, folderDone)
							}
							else {
								fs.unlink(filePath, folderDone)
							}
						});
				});
	});
}

const moveToDirectory = function(filename, targetFilename, onDone)
{
	const path = rootDir + filename
	const targetPath = rootDir + targetFilename

	fs.rename(path, targetPath,
		(error) => {
			if(error) {
				handleError("moveToDir", error, onDone)
				return
			}

			if(onDone) {
				onDone(path)
			}
		})
}

const resolvePath = function(path) 
{
	path = path.replace(/\\/g, "/")

	if(path.length > rootDir.length) {
		return path.slice(rootDir.length)
	}
	return rootDir.slice(path.length)
}

const handleError =  function(type, error, onDone)
{
	console.error("(FileSystemLocal." + type + ")", error)
	if(onDone) {
		onDone(error, null)
	}
}

const context = {
	init,
	create,
	read,
	write,
	writeBlob,
	writeBase64,
	remove,
	moveTo,
	checkDirectory,
	readDirectory,
	createDirectory,
	createDirectories,
	removeDirectory,
	moveToDirectory,
	resolvePath,

	get fullPath() {
		return context.url + rootDir
	},

	url: "",

	set rootDirectory(value) 
	{
		rootDir = value.replace(/\\/g, "/")

		if(rootDir) {
			if(rootDir[rootDir.length - 1] !== "/") {
				rootDir += "/"
			}
		}
	},
	get rootDirectory() {
		return rootDir
	}
}

export default context
