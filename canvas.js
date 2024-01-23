let canvas = document.querySelector('canvas')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColorAll = document.querySelectorAll('.pencil-color-cont')
let pencilWidthElem = document.querySelector('.pencil-width')
let eraserWidthElem = document.querySelector('.eraser-width')

//defining the values
let pencilColor = 'red';
let eraserColor = 'white'
let pencilWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

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
    beginPath({
        x: e.clientX,  //clientX,Y  = give the exact value where the mouse clicks down
        y: e.clientY
    })
})

canvas.addEventListener('mousemove', (e)=>{
    if(mousedown){
        drawStroke({
            x: e.clientX,
            y: e.clientY
        })
    }
})

canvas.addEventListener('mouseup',()=>{
    mousedown = false
})

function beginPath(strokeObj){
    tool.beginPath()
    tool.moveTo(strokeObj.x, strokeObj.y) 
}

function drawStroke(strokeObj){
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
    
})