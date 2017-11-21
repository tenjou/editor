
if(process && process.versions && process.versions.electron) {
	import FileSystemLocal from "./FileSystemLocal"
	export default FileSystemLocal
}
else {
	import FileSystemWeb from "./FileSystemWeb"
	export default FileSystemWeb
}