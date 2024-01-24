
let canvas = document.querySelector('canvas')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColorAll = document.querySelectorAll('.pencil-color-cont')
let pencilWidthElem = document.querySelector('.pencil-width')
let eraserWidthElem = document.querySelector('.eraser-width')
let download = document.querySelector('.download')
let undo = document.querySelector('.undo')
let redo = document.querySelector('.redo')

//defining the values
let pencilColor = 'red';
let eraserColor = 'white'
let pencilWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

let undoRedoTracker = []
let track = 0

let mousedown = false;

let tool = canvas.getContext('2d')
tool.strokeStyle = pencilColor // u have to update it below on change the values
tool.lineWidth = pencilWidth  // u have to update it below on change the values

//Just for your reference on how it works
// tool.beginPath()
// tool.moveTo(10,10) //Start point
// tool.lineTo(100,150) //End point
// tool.stroke()

// //If u wanted to continue the line without adding the new starting point then the below code will work

// tool.lineTo(400,200)
// tool.stroke()


//mousedown --> start new path, mousemove --> path fill

canvas.addEventListener('mousedown', (e)=>{
    mousedown = true

    // beginPath({
    //     x: e.clientX,  //clientX,Y  = give the exact value where the mouse clicks down
    //     y: e.clientY
    // })

    let data = {
        x: e.clientX,
        y: e.clientY
    }

    //send data to server
    socket.emit('beginPath', data) //this is used to send the data 
})

canvas.addEventListener('mousemove', (e)=>{

    if(mousedown){
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : pencilColor,
            width: eraserFlag ? eraserWidth : pencilWidth
        }
        socket.emit('drawStroke', data)
    }

    // if(mousedown){
    //     drawStroke({
    //         x: e.clientX,
    //         y: e.clientY,
    //         color: eraserFlag ? eraserColor : pencilColor,
    //         width: eraserFlag ? eraserWidth : pencilWidth
    //     })
    // }
})

canvas.addEventListener('mouseup',()=>{
    mousedown = false

    let url = canvas.toDataURL();
    undoRedoTracker.push(url)
    track = undoRedoTracker.length - 1 //if the track is 3 the 3-1  = 2 so it should point of 2 basically 0 indexing game
})

undo.addEventListener('click',()=>{ //undo meand going back
    if(track > 0){ //because there should be atleast one element so greater than 0
        track--
    }

    //Track Action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    // undoRedoCanvas(trackObj)
    socket.emit('undoRedo', data)
})
redo.addEventListener('click',()=>{ //redo means going front
    if(track < undoRedoTracker.length - 1){
        track++
    }

    //Track Action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    // undoRedoCanvas(trackObj)
    socket.emit('undoRedo', data)
})



function undoRedoCanvas(trackObj){
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker

    let url = undoRedoTracker[track]
    let img = new Image()// It will create a new Image's reference element 
    img.src = url

    img.onload = (e)=>{ //you can even write it this way instead of addEventListner
        tool.drawImage(img,0,0,canvas.width, canvas.height)
    }

}


function beginPath(strokeObj){
    tool.beginPath()
    tool.moveTo(strokeObj.x, strokeObj.y) 
}

function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color
    tool.lineWidth = strokeObj.width
    tool.lineTo(strokeObj.x, strokeObj.y)
    tool.stroke()
}

pencilColorAll.forEach(colorElem=>{
    colorElem.addEventListener('click',(e)=>{
        let color = e.target.classList[0];
        pencilColor = color;
        tool.strokeStyle = pencilColor //updating the color
    })
})

pencilWidthElem.addEventListener('change',()=>{ //carefull we are using pencilWidthElem and not pencilWidth variable
    pencilWidth = pencilWidthElem.value   
    tool.lineWidth = pencilWidth //Updating
})

eraserWidthElem.addEventListener('change',()=>{
    eraserWidth = eraserWidthElem.value;    
    tool.lineWidth = eraserWidth
})

eraser.addEventListener('click',(e)=>{ //this eraser variable is not defined in this file its defined in tools.js file but it is accessable here
    if(eraserFlag){
        tool.strokeStyle = eraserColor
        tool.lineWidth = eraserWidth
    } else{
        tool.strokeStyle = pencilColor
        tool.lineWidth = pencilWidth
    }
})

download.addEventListener('click',(e)=>{

    let url = canvas.toDataURL(); //this is the new method to get the url in canvas

    let a = document.createElement('a')
    a.href = url;
    a.download = 'board.jpg';
    a.click()
})

 //This .on is basically a listner
//Means even we wanted that data 
socket.on('beginPath',(data)=>{
    //data -> data from server

    beginPath(data)
})

socket.on('drawStroke',(data)=>{
    drawStroke(data)
})

socket.on('undoRedo', (data)=>{
    undoRedoCanvas(data)
})