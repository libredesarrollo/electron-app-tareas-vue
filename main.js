const { app, BrowserWindow, ipcMain } = require('electron')

const mydb = require("./database")
const auth = require('./auth')

function createWindow() {
    let win = new BrowserWindow(
        {
            width: 1500,
            height: 600,
            //movable: false,
            //resizable:false,
            webPreferences: {
                nodeIntegration: true
            }
        }
    )

    auth.win_login(win)

    //win.loadFile("index.html")
    // 
    if (process.env.DEBUG == 'true')
        win.loadURL('http://localhost:8080/');
    else
        win.loadURL('file://' + __dirname + '/dist/index.html');

    win.webContents.openDevTools()
    //console.log(__dirname)
    mydb.create_db()

    ipcMain.on('get-token', (event, data) => {
        //console.log("Token PP "+auth.get_auth())
        win.webContents.send('get-token',auth.get_auth().toString());
    })
    

}

app.whenReady().then(createWindow)

app.on('ready', () => {
    ipcMain.on('item-send', (event, data) => {
        mydb.item_all()
    })

})
