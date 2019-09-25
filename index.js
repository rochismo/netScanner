const app = require('electron').app;
const Window = require('electron').BrowserWindow; // jshint ignore:line
const Tray = require('electron').Tray; // jshint ignore:line
const Menu = require('electron').Menu; // jshint ignore:line
let Server =require("./lib/server");;

let server = new Server();;
let mainWindow = null;



function createWindow() {
	server.init();
	server.addRoutes();
	server.listen();
	mainWindow = new Window({
		width: 640,
		height: 480,
		autoHideMenuBar: false,
		useContentSize: true,
		resizable: true
		//  'node-integration': false // otherwise various client-side things may break
	});
	mainWindow.loadURL('http://localhost:3000/');
}

app.on('ready', createWindow)
