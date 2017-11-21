
let fs = null
let rootDir = ""
let writeQueue = []

const init = function(onDone, onError)
{
	if(fs) { return }

	const persistentStorage = navigator.persistentStorage || navigator.webkitPersistentStorage
	const requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem
	const resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL

	if(!persistentStorage) {
		onError()
		return
	}

	persistentStorage.requestQuota(1024*1024*1024,
		(grantedBytes) =>
		{
			if(grantedBytes === 0) {
				return
			}

			requestFileSystem(PERSISTENT, grantedBytes,
				(fileSystem) => {
					fs = fileSystem.root
					context.ready = true

					resolveLocalFileSystemURL(`filesystem:${location.origin}/persistent/`, (entry) => {
						context.url = entry.toURL()
						onDone(null)
					}, (error) => {
						console.log(error)
					})
				},
				(fileError) => {
					handleError(fileError, onDone, "init")
				})
		},
		(error) => {
			if(onDone) {
				onDone(`(FileSystem:webkitPersistentStorage) ${error}`)
			}
		})
}

const create = function(filename, onDone)
{
	const path = rootDir + filename;

	fs.getFile(path, { create: true }, 
		(fileEntry) => {
			onDone(null, fileEntry.toURL())
		},
		(fileError) => {
			handleError(fileError, onDone, "create", filename)
		})
}

const read = function(filename, onDone)
{
	const path = rootDir + filename

	fs.getFile(path, {},
		(fileEntry) => {
			handleReadDone(fileEntry, onDone)
		},
		(fileError) => {
			handleError(fileError, onDone, "read", filename)
		})
}

const handleReadDone = function(fileEntry, onDone)
{
	fileEntry.file(
		(file) => {
			const reader = new FileReader()
			reader.onload = function() {
				onDone(null, this.result)
			}
			reader.readAsText(file)
		},
		(fileError) => {
			handleError(fileError, onDone, "read", fileError.name)
		})
}

const readBlob = function(filename, onDone)
{
	const path = rootDir + filename

	fs.getFile(path, {},
		(fileEntry) => {
			handleReadBlobDone(fileEntry, onDone)
		},
		(fileError) => {
			handleError(fileError, onDone, "readBlob", filename)
		})
}

const handleReadBlobDone = function(fileEntry, onDone)
{
	fileEntry.file(
		(file) => {
			onDone(null, file);
		},
		(fileError) => {
			handleError(fileError, onDone, "readBlob", fileError.name)
		})
}

const write = function(filename, content, onDone)
{
	const path = rootDir + filename

	fs.getFile(path, { create: true },
		(fileEntry) => {
			writeContent(fileEntry, content, onDone, false)
		},
		(fileError) => {
			handleError(fileError, onDone, "write", filename)
		})
}

const writeBlob = function(filename, blob, onDone)
{
	const path = rootDir + filename

	fs.getFile(path, { create: true },
		(fileEntry) => {
			writeContent(fileEntry, blob, onDone, true)
		},
		(fileError) => {
			handleError(fileError, onDone, "writeBlob", filename)
		})
}

const writeContent = function(fileEntry, content, onDone, isBlob) 
{
	if(writeQueue.length > 0) {
		writeQueue.push({ fileEntry, content, onDone, isBlob })
	}
	else 
	{
		if(isBlob) {
			writeContentBlob(fileEntry, content, onDone)
		}
		else {
			writeContentText(fileEntry, content, onDone)
		}
	}
}

const nextWrite = function()
{
	const next = writeQueue.pop()
	if(next) 
	{
		if(next.isBlob) {
			writeContentBlob(next.fileEntry, next.content, next.onDone)
		}
		else {
			writeContentText(next.fileEntry, next.content, next.onDone)
		}
	}
}

const writeContentText = function(fileEntry, content, onDone)
{
	fileEntry.createWriter(
		(fileWritter) =>
		{
			fileWritter.onwriteend = () =>
			{
				fileWritter.onwriteend = () => {
					onDone(null, fileEntry)
					nextWrite()
				}

				const blob = new Blob([ content ], { type: "text/plain" })
				fileWritter.write(blob)
			}

			fileWritter.onerror = () => {
				onDone(`(FileSystem:createWriter) Could not write in: ${fileEntry.name}`)
			}

			fileWritter.truncate(1)
		},
		(fileError) => {
			handleError(fileError, onDone, "createWritter", filename)
		})
}

const writeContentBlob = function(fileEntry, blob, onDone)
{
	fileEntry.createWriter(
		(fileWritter) =>
		{
			fileWritter.onwriteend = () =>
			{
				fileWritter.onwriteend = () => {
					onDone(null, fileEntry.toURL())
					nextWrite()
				}

				fileWritter.write(blob)
			}

			fileWritter.onerror = () => {
				onDone(`(FileSystem:createWriter) Could not write in: ${fileEntry.name}`)
			}

			fileWritter.truncate(1)
		},
		(fileError) => {
			handleError(fileError, onDone, "createWritter", filename)
		})
}

const remove = function(filename, onDone)
{
	fs.getFile(rootDir + filename, { create: false },
		(fileEntry) =>
		{
			fileEntry.remove(
				() => {
					onDone(null, fileEntry.toURL())
				},
				(fileError) => {
					handleError(fileError, onDone, "remove", filename)
				})
		},
		(fileError) => {
			handleError(fileError, onDone, "remove", filename)
		})
}

const moveTo = function(path, targetPath, onDone)
{
	const targetPathIndex = targetPath.lastIndexOf("/") + 1

	fs.getFile(rootDir + path, {},
		(fileEntry) =>
		{
			fs.getDirectory(rootDir + targetPath.substr(0, targetPathIndex), {},
				(dirEntry) =>
				{
					fileEntry.moveTo(dirEntry, targetPath.substr(targetPathIndex),
						(fileEntry) => {
							onDone(null, fileEntry.toURL())
						},
					(fileError) => {
						handleError(fileError, onDone, "rename", path)
					})
				},
				(fileError) => {
					handleError(fileError, onDone, "rename-getDir", path)
				})
		},
		(fileError) => {
			handleError(fileError, onDone, "rename-getFile", path)
		})
}

const checkDirectory = function(name, onDone)
{
	fs.getDirectory(rootDir + name, {},
		(dirEntry) => {
			onDone(null, dirEntry.toURL())
		},
		(fileError) => {
			handleError(fileError, onDone, "checkDirectory", name)
		})
}

const readDirectory = function(name, onDone)
{
	fs.getDirectory(rootDir + name, {},
		(dirEntry) =>
		{
			const dirReader = dirEntry.createReader()

			dirReader.readEntries(
				(results) => {
					onDone(null, results)
				},
				(fileError) => {
					handleError(fileError, onDone, "readDirectory", name)
				})
		},
		(fileError) => {
			handleError(fileError, onDone, "readDirectory", name)
		})
}

const createDirectory = function(name, onDone)
{
	const path = rootDir + name

	fs.getDirectory(path, { create: true },
		(dirEntry) => {
			onDone(null, dirEntry.toURL());
		},
		(fileError) => {
			handleError(fileError, onDone, "createDirectory", name);
		})
}

const createDirectories = function(dirs, onDone)
{
	const path = rootDir + dirs

	fs.getDirectory(path, {},
		(dirEntry) => {
			onDone(null)
		},
		(fileError) => {
			const buffer = dirs.split("/")
			const num = buffer.length
			let index = 0
			let path = buffer[index]

			createDirectoriesFunc(rootDir, index, buffer, onDone)
		})
}

const createDirectoriesFunc = function(path, index, buffer, onDone)
{
	if(index === buffer.length) {
		onDone(null)
	}
	else 
	{
		path += buffer[index] + "/"

		fs.getDirectory(path, { create: true},
			(dirEntry) => {
				index++
				createDirectoriesFunc(path, index, buffer, onDone)
			},
			(fileError) => {
				handleError(fileError, onDone, "createDirecotries", name)
			})
	}	
}

const removeDirectory = function(name, onDone)
{
	const path = rootDir + name

	fs.getDirectory(path, {},
		(dirEntry) =>
		{
			dirEntry.removeRecursively(
				() => {
					onDone(null, dirEntry.toURL())
				},
				(fileError) => {
					handleError(fileError, onDone, "removeDirectory", filename);
				})
		},
		(fileError) => {
			handleError(fileError, onDone, "removeDirectory", name);
		})
}

const moveToDirectory = function(path, targetPath, onDone)
{
	const targetPathIndex = targetPath.lastIndexOf("/") + 1

	fs.getDirectory(rootDir + path, {},
		(parentDirEntry) =>
		{
			fs.getDirectory(rootDir + targetPath.substr(0, targetPathIndex), {},
				(dirEntry) =>
				{
					parentDirEntry.moveTo(dirEntry, targetPath.substr(targetPathIndex),
						(newDirEntry) => {
							onDone(null, newDirEntry.toURL())
						},
						(fileError) => {
							handleError(fileError, onDone, "moveToDirectory", path)
						})
				},
				(fileError) => {
					handleError(fileError, onDone, "moveToDirectory", path)
				})
		},
		(fileError) => {
			handleError(fileError, onDone, "moveToDirectory", path);
		})
}

const metadata = function(fileEntry, onDone) 
{
	fileEntry.getMetadata((data) => {
		onDone(null, data)
	})
}

const resolvePath = function(path) 
{
	const fullUrl = context.url + rootDir

	if(path.length > fullUrl.length) {
		return path.slice(fullUrl.length)
	}
	return fullUrl.slice(path.length)
}

const handleError = function(fileError, onDone, type, filename)
{
	if(filename) {
		onDone(`(FileSystem:${type}) ${fileError.name} '${filename}'`)
	}
	else {
		onDone(`(FileSystem:${type}) ${fileError.name}`)
	}
}

const context = 
{
	init,
	create,
	read,
	readBlob,
	write,
	writeBlob,
	remove,
	moveTo,
	checkDirectory,
	readDirectory,
	createDirectory,
	createDirectories,
	removeDirectory,
	moveToDirectory,
	metadata,
	resolvePath,

	url: "",
	ready: false,

	get fullPath() {
		return context.url + rootDir
	},

	set rootDirectory(value) 
	{
		if(value[value.length - 1] !== "/") {
			value += "/"
		}

		rootDir = value
	},
	get rootDirectory() {
		return rootDir
	}
}

export default context
