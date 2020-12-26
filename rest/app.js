var express = require('express');
var cors = require('cors');
var app = express();

const task = require('./db')
const auth = require('../auth')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

var corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
/** Usuarios */

app.get('/user/token/:user_id',cors(corsOptions), function (req, res) {
    task.getUserToken(req.params.user_id, (data) => {
        res.json(data);
    })
});


app.get('/user/info/:token',cors(corsOptions), function (req, res) {
    task.getInfoUserByToken(req.params.token, (data) => {
        res.json(data);
    })
});

app.post('/login',cors(corsOptions), function (req, res) {
    task.login(req.body.username, req.body.password, (data) => {
        res.json(data);

        if(data.token) // login existoso - tenenos token
            auth.set_auth(data.token)
        else // login fallo
            auth.set_auth("")
    })
});

app.post('/logout',cors(corsOptions), function (req, res) {
    console.log("logout")
    task.logout(req.body.token)
    auth.set_auth("")
    res.json("Ok")
});

/** Tareas */

app.get('/task',cors(corsOptions), function (req, res) {
    task.getTasks((data) => {
        res.json(data);
    })
});

app.get('/task/:id',cors(corsOptions), function (req, res) {
    task.getTask(req.params.id, (data) => {
        res.json(data);
    })
});

app.post('/task',cors(corsOptions), function (req, res) {
    //console.log("hola mundo: "+req.body.task)

    const dataTask = {
        task:req.body.task
    }

    task.insertTask(dataTask, (data) => {
        res.json(data);
    })
});

app.put('/task/:id',cors(corsOptions), function (req, res) {

    const dataTask = {
        task:req.body.task
    }

    task.updateTask(req.params.id,dataTask, (data) => {
        res.json(data);
    })
});

app.delete('/task/:id',cors(corsOptions), function (req, res) {
    task.deleteTask(req.params.id, (data) => {
        res.json(data);
    })
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});