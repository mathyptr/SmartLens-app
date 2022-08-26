function placeButton() {
    var cameraView = document.getElementById("camera--view")
    x_pos = Math.floor(Math.random() * (cameraView.offsetWidth + 1))
    y_pos = Math.floor(Math.random() * (cameraView.offsetHeight + 1))
    var d = document.getElementById('camera--trigger');
    d.style.position = "absolute";
    d.style.left = x_pos+'px';
    d.style.top = y_pos+'px';
    d.style.width = Math.floor(Math.random() * (200))+'px';
    d.style.height = Math.floor(Math.random() * (200))+'px';
}



function detailsButtons() {
    var cameraView = document.getElementById("camera--view")
    for(let i = 0; i < 4 ; i++){
        var e= document.getElementById('detail'+i);
        e.style.display = 'none';
    }
    for(let i = 0; i < Math.random() * (4) ; i++){
        var el= document.getElementById('detail'+i);
        x_pos = Math.floor(Math.random() * (cameraView.offsetWidth + 1))
        y_pos = Math.floor(Math.random() * (cameraView.offsetHeight + 1))
        el.style.position = "absolute";
        el.style.left = x_pos+'px';
        el.style.top = y_pos+'px';
        el.style.width = Math.floor(Math.random() * (200))+'px';
        el.style.height = Math.floor(Math.random() * (200))+'px';
        el.style.display = 'block';
    }
}

const interval = setInterval(detailsButtons, 500);
