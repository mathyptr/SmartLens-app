//onst draggableArea = document.getElementById('divDetail')
//const camera_box = document.getElementById('focusImg');
const camera_box = document.getElementById('divDetail')

let dragdrop=document.getElementById("btnCrop");

var x, y, width, height = undefined;

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function deleteCookie(cname) {
    document.cookie = cname+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}



var state = 0;
var visible = true;
var x = window.matchMedia("(max-width: 800px)");
if (x.matches) {} // If media query matches
else {
    var showMore = document.getElementById("showMore");
    var slideshow = document.getElementById("focusImg");
    requestAnimationFrame(update);
    function update() {
        if (state == 0) {
            slideshow.addEventListener("mousemove",  mouseMovePosition);
        } else {
            slideshow.addEventListener("mouseout", mouseOutVisibility);
        }
        if(!visible){
            slideshow.removeEventListener('mousemove', mouseMovePosition);
            slideshow.removeEventListener('mouseout', mouseOutVisibility);
            return;
        }
        requestAnimationFrame(update);
    }
}

function mouseMovePosition(event){
    let left = event.pageX + 20 + "px";
    let top = event.pageY - 120 + "px";
    state = 1;
    showMore.style.visibility = "visible";
    showMore.style.left = left;
    showMore.style.top = top;
}

function mouseOutVisibility(){
    showMore.style.visibility = "hidden";
    state = 0;
}


var isEventSupported = (function(){
    var TAGNAMES = {
      'select':'input','change':'input',
      'submit':'form','reset':'form',
      'error':'img','load':'img','abort':'img'
    }
    function isEventSupported(eventName) {
      var el = document.createElement(TAGNAMES[eventName] || 'div');
      eventName = 'on' + eventName;
      var isSupported = (eventName in el);
      if (!isSupported) {
        el.setAttribute(eventName, 'return;');
        isSupported = typeof el[eventName] == 'function';
      }
      el = null;
      return isSupported;
    }
    return isEventSupported;
    })();
    
    
    
    const onDragStart = (event) => {
    dragPosition = touchPosition(event).pageY
    dragPositionXStart = touchPosition(event).pageX
    dragPositionYStart = dragPosition
    //draggableArea.style.cursor = document.body.style.cursor = "grabbing"
    camera_box.style.cursor = document.body.style.cursor = "grabbing"
    
    var bounding_boxes = document.getElementsByClassName('bounding-box')
    for (var i = bounding_boxes.length - 1; i >= 0; i--) {
        bounding_boxes[i].remove();
    }
    
    }
    
    const onDragMove = (event) => {
    if (dragPosition === undefined) return
    
    dragPosition = touchPosition(event).pageY
    
    
    var bounding_boxes = document.getElementsByClassName('bounding-box')
    for (var i = bounding_boxes.length - 1; i >= 0; i--) {
        bounding_boxes[i].remove();
    }
    
    var bb=[]
    
    bb[0]=dragPositionXStart 
    bb[1]=dragPositionYStart 
    bb[2]= touchPosition(event).pageX
    bb[3]= touchPosition(event).pageY
    
    
    drawB(bb, colors[0]);
    
    //    sheetContents.classList.remove("not-selectable")
   // draggableArea.style.cursor = document.body.style.cursor = ""
    camera_box.style.cursor = document.body.style.cursor = ""
    
    }
    
    const onDragEnd = (event) => {
        var bb=[]
    
    bb[0]=dragPositionXStart 
    bb[1]=dragPositionYStart 
    bb[2]= touchPosition(event).pageX
    bb[3]= touchPosition(event).pageY
    
    drawB(bb, colors[0]);
    dragPosition = undefined
    //    sheetContents.classList.remove("not-selectable")
   // draggableArea.style.cursor = document.body.style.cursor = ""
     camera_box.style.cursor = document.body.style.cursor = ""
     if(width>5&&height>5){
        console.log('left='+ String(x)+' top='+ String(y)+' width='+String(width) + ' height='+String(height));
        saveBbox(nClk, getCookie("artwork"),String(x), String(y),String(width),String(height));
     }
    }

    const touchPosition = (event) =>
        event.touches ? event.touches[0] : event
        
        var dragPosition
        var dragPositionXStart
        var dragPositionYStart
        var dragPositionXEnd
        var dragPositionYEnd
        var colors = ['#2E92A9', '#F4F4F4', '#EF7365', '#FBD26C']

        function drawB(bounding_box, color) {
            let box = document.createElement('p');
            camera_box.appendChild(box)
           // let x, y, width, height = undefined;
            
            if(bounding_box[0]<bounding_box[2]){
                x=bounding_box[0]
                width=bounding_box[2]-bounding_box[0]
            }
            else{
                x=bounding_box[2]
                width=bounding_box[0]-bounding_box[2]
            }
            
            if(bounding_box[1]<bounding_box[3]){
                y=bounding_box[1]
                height=bounding_box[3]-bounding_box[1]
            }
            else{
                y=bounding_box[3]
                height=bounding_box[1]-bounding_box[3]
            }
            
            
            //console.log('left='+ String(x)+' top='+ String(y)+' width='+String(width) + ' height='+String(height));
            
            box.style.position = 'fixed'
            box.style.zIndex = '2'
            box.style.left = String(x) + 'px';
            box.style.top = String(y) + 'px';
            box.style.width = String(width) + 'px';
            box.style.height = String(height) + 'px';
            if(width>5&&height>5)
                box.style.border = '4px solid ' + color;
            else
                box.style.border = '0px solid ' + color;
            box.style.margin = '0';
            box.classList.add('bounding-box');
            }  
 var nClk=0;
function startDrag(){ 
    console.log('clicked '+nClk)
    dragdrop.innerText="done_outline";

// disable and enable hover banner
if(visible){
    visible = false;
    setCookie("dragStatus", 0, 1);
}


if (isEventSupported("onpointerdown")) {
domElement.addEventListener("pointerdown", onDragStart, false);
domElement.addEventListener("pointermove", onPointerHover, false);
domElement.addEventListener("pointermove", onPointerMove, false);
domElement.addEventListener("pointerup", onPointerUp, false);
} else if (isEventSupported("ontouchstart")) {
domElement.addEventListener("touchstart", onDragStart, false);
domElement.addEventListener("touchmove", onPointerHover, false);
domElement.addEventListener("touchmove", onPointerMove, false);
domElement.addEventListener("touchend", onPointerUp, false);
} else if (isEventSupported("onmousedown")) {
domElement.addEventListener("mousedown", onDragStart, false);
domElement.addEventListener("mousemove", onPointerHover, false);
domElement.addEventListener("mousemove", onPointerMove, false);
domElement.addEventListener("mouseup", onPointerUp, false);
}

window.addEventListener("pointerdown", onDragStart, false);


window.addEventListener("mousemove", onDragMove)
window.addEventListener("touchmove", onDragMove)

window.addEventListener("mouseup", onDragEnd)
window.addEventListener("touchend", onDragEnd)

}


function stopDrag(){ 
    dragdrop.innerText="crop_free";
    window.removeEventListener("touchstart", onDragStart, false);
    window.removeEventListener("mousedown", onDragStart, false);
    window.removeEventListener("mousemove", onDragMove)
    window.removeEventListener("touchmove", onDragMove)
    window.removeEventListener("mouseup", onDragEnd)
    window.removeEventListener("touchend", onDragEnd)
    visible = true;
    //console.log('left='+ String(x)+' top='+ String(y)+' width='+String(width) + ' height='+String(height));
    //insert nel db dei bbox primo id dettaglio relativo all'opera nel cookie + nClick
    //saveBbox(nClk, getCookie("artwork"),String(x), String(y),String(width),String(height));
    requestAnimationFrame(update);
    //document.getElementsByClassName("bounding-box")[0].style.display = "none";
    nClk++;
}



if(dragdrop!=null){
    dragdrop.onclick= function (){ 
        if(getCookie("dragStatus") == "")
            startDrag();
        else{
            deleteCookie("dragStatus")
            stopDrag();
        }
            
    }   
}



function saveBbox (clk, idArt, left, top, width,height){
    var request_type = "saveBbox";
    $.ajax({
        type: "POST",
        url: "server/actions.php",
        data: {
            "action": request_type,
            "clk":clk,
            "idArt":idArt,
            "left": left,
            "top": top,
            "width": width,
            "height": height
        },
        async: false
        });
   
}



