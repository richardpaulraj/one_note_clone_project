// if you wanted to install any node modules then simply do npm init and press Enter
//Then npm i express

const express = require('express') //Use to Access
const socket = require('socket.io')

const app = express() //This will initialize and server ready
app.use(express.static('public'))

let port = 3000;
let server = app.listen(port,()=>{
     console.log(`listening to port ${port}`)
})

let io = socket(server)

io.on('connection', (socket)=>{ //similar to addEventListner
    console.log('Made Socket Connection')

    //Received Data
    socket.on('beginPath',(data)=>{
        //data -> data from frontend
        //Now transfer data to all connected computers
        io.sockets.emit('beginPath', data) //sockets means all the socket connected computer
    })

    socket.on('drawStroke', (data)=>{

        io.sockets.emit('drawStroke', data)
    })

    socket.on('undoRedo', (data)=>{
        io.sockets.emit('undoRedo', data )
    })
})
