import editor from "./editor"

export default function main()
{
	window.addEventListener("dragover", (event) => event.preventDefault())
	window.addEventListener("drop", (event) => event.preventDefault())
    
    editor.setup()
}