const fs = require('fs')
const { ipcMain, BrowserWindow } = require("electron");

module.exports.set_auth = (token) => {
    fs.writeFile('rest/token.auth', token, function (err) {
        if (err) throw err;
        console.log('Token establecido correctamente')
    })
}

module.exports.get_auth = () => {

    console.log("get_auth 1")
    let token = null

    try {
        token = fs.readFileSync('rest/token.auth')
        /* fs.readFile('token.auth', function(err,data){
             console.log(err)
 
             if(err.code == 'ENOENT'){
                 console.log("El archivo no existe")
             }
 
             //if(err) throw err;
     
             console.log("data: "+data)
     
             token = data
     
         })*/
    } catch (error) {
        console.log(error)
    }

    console.log("get_auth 2 " + token)

    return token;

}

module.exports.win_login = function (winPrimary) {
    let extrawin;

    ipcMain.on('open-window-login', (event, data) => {
        /*const modelPath = process.env.DEBUG
           ? 'http://localhost:8080/'
           : 'https://www.google.com'*/

        const modelPath = 'http://localhost:8080/login'

        extrawin = new BrowserWindow(
            {
                width: 600, height: 600,
                parent: BrowserWindow.fromId(winPrimary.id),
                modal: true,
                webPreferences: {
                    nodeIntegration: true
                }
            })
        extrawin.loadURL(modelPath)

        extrawin.openDevTools()

        //console.log("Ventana principal " + idPrimary + " y secundaria " + extrawin.id)

        extrawin.on('closed', function () {
            console.log("Ventana cerrada")
            BrowserWindow.fromId(winPrimary.id).close()
            //idPrimary
        })
    })

    ipcMain.on('close-window-login', (event, data) => {
        extrawin.close()
        winPrimary.webContents.send('get-token',this.get_auth().toString());
    })
}