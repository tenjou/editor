const electron = require('electron')
const path = require('path')
const url = require('url')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let win

const createWindow = function() {
	win = new BrowserWindow({width: 1300, height: 820})

	win.loadURL(
		url.format({
			pathname: path.join(__dirname, 'index.html'),
			protocol: 'file:',
			slashes: true
		})
	)

	win.webContents.openDevTools()

	win.on('closed', function() {
		win = null
	})

}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
	app.quit()
})