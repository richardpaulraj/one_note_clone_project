{/* <i class="fa-solid fa-xmark"></i> */}

let optionsCont = document.querySelector('.options-cont');
let toolsCont = document.querySelector('.tools-cont')
let pencilToolCont = document.querySelector('.pencil-tool-cont')
let eraserToolCont = document.querySelector('.eraser-tool-cont')
let pencil = document.querySelector('.pencil')
let eraser = document.querySelector('.eraser')
let stickyNote = document.querySelector('.stickyNote')
let upload = document.querySelector('.upload')

//Flag
let optionsFlag = true;
let pencilFlag = false;
let eraserFlag = false;

optionsCont.addEventListener('click', (e)=>{
    
    
    if(optionsFlag){
        openTools()
    } else{
        closeTools() 
    }

    optionsFlag = !optionsFlag

        function openTools(){
            let iconElem = optionsCont.children[0]

            iconElem.classList.remove('fa-xmark')
            iconElem.classList.add('fa-bars')
            toolsCont.style.display = 'none'
            pencilToolCont.style.display = 'none'
            eraserToolCont.style.display = 'none'
        }
        function closeTools(){
            let iconElem = optionsCont.children[0]
            iconElem.classList.remove('fa-bars')
            iconElem.classList.add('fa-xmark')
            toolsCont.style.display = 'flex'
        }
})

pencil.addEventListener('click',()=>{
    
    pencilFlag ? pencilToolCont.style.display = 'none' : pencilToolCont.style.display = 'block' //here generally to show the display:none elements we use display: block or display: flex depending on What is used in the css class if nothing then block

    pencilFlag = !pencilFlag
})

eraser.addEventListener('click',()=>{
    
    eraserFlag ? eraserToolCont.style.display = 'none' : eraserToolCont.style.display = 'flex' 

    eraserFlag = !eraserFlag
})

upload.addEventListener('click',()=>{
    //To open file explorer
    let input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.click()

    input.addEventListener('change', (e)=>{
        let file = input.files[0]
        let url = URL.createObjectURL(file)

        let stickyTemplateHTML = `
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img src = ${url} />
        </div>
        `;

        createSticky(stickyTemplateHTML)
    })


})

stickyNote.addEventListener('click',()=>{
    //Here its textarea and the above one is image  so thats y created this html code
    let stickyTemplateHTML = `
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <textarea spellcheck ='false'></textarea>
    </div>
    `

    createSticky(stickyTemplateHTML)

})

//I am making this function because its used in Sticky notes as well as in image upload
function createSticky(stickyTemplateHTML){
    let stickyCont = document.createElement('div')  
    stickyCont.classList.add('sticky-cont')
    stickyCont.innerHTML = stickyTemplateHTML

    document.body.appendChild(stickyCont)

    let minimize = stickyCont.querySelector('.minimize')
    let remove = stickyCont.querySelector('.remove')
    noteActions(minimize, remove, stickyCont)

    stickyCont.onmousedown = ()=>{
        dragAndDrop(stickyCont)
    }
}

function noteActions(minimize, remove, stickyCont){

    //Code to remove the Cont
    remove.addEventListener('click',()=>{
        stickyCont.remove()
    })

    //Code to Minimize
    minimize.addEventListener('click', ()=>{
        let noteCont = stickyCont.querySelector('.note-cont')
        let display = getComputedStyle(noteCont).getPropertyValue('display')
        
        if(display === 'none'){
            noteCont.style.display = 'block'
        }else{
            noteCont.style.display = 'none'
        }
        
    })
}

function dragAndDrop(element){

    element.onmousedown = function(event) {

        let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;
      
        element.style.position = 'absolute';
        element.style.zIndex = 1000;
      
        moveAt(event.pageX, event.pageY);
      
        // moves the element at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
            element.style.left = pageX - shiftX + 'px';
            element.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // move the element on mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // drop the element, remove unneeded handlers
        element.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          element.onmouseup = null;
        };
      
    };
      
    element.ondragstart = function() {
        return false; //if we dont put this the drag dosent works properly
    };
}