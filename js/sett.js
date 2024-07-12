        // Get the modal
        var modalTitle = document.getElementById("modalTitle");
        var modalAuthor = document.getElementById("modalAuthor");
        var modalDesc = document.getElementById("modalDesc");
        
        // Get the button that opens the modal
        var btnTitle = document.getElementById("btnTitle");
        var btnAuthor= document.getElementById("btnAuthor");
        var btnDesc = document.getElementById("btnDesc");
        
        // Get the <span> element that closes the modal
        var spanTitle = document.getElementsByClassName("close")[0];
        var spanAuthor = document.getElementsByClassName("close")[1];
        var spanDesc = document.getElementsByClassName("close")[2];
        var modTitle = document.getElementsByClassName("mod")[0];
        var modAuthor = document.getElementsByClassName("mod")[1];
        var modDesc = document.getElementsByClassName("mod")[2];

        // console.log(document.getElementsByClassName("mod")[0]);
        // console.log(document.getElementsByClassName("mod")[1]);
        // console.log(document.getElementsByClassName("mod")[2]);
        
        // When the user clicks the button, open the modal 
        btnTitle.onclick = function () {
            modalTitle.style.display = "block";
        }
        btnAuthor.onclick = function () {
            modalAuthor.style.display = "block";
        }
        btnDesc.onclick = function () {
            modalDesc.style.display = "block";
        }

        // When the user clicks on <span> (x), close the modal
        spanTitle.onclick = function(){
            modalTitle.style.display = "none";
            document.getElementById("modTitle").disabled=true;
        }
        spanAuthor.onclick = function(){
            modalAuthor.style.display = "none";
            document.getElementById("modAuthor").disabled=true;
        }
        spanDesc.onclick = function(){
            modalDesc.style.display = "none";
            document.getElementById("modDesc").disabled=true;
        }
        modTitle.onclick = function(){
            document.getElementById("modTitle").disabled=false;
        }
        modAuthor.onclick = function(){
            document.getElementById("modAuthor").disabled=false;
        }
        modDesc.onclick = function(){
            document.getElementById("modDesc").disabled=false;
        }
      
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          if (event.target == modalTitle) {
            modalTitle.style.display = "none";
            document.getElementById("modTitle").disabled=true;
          }
          else if (event.target == modalAuthor) {
            modalAuthor.style.display = "none";
            document.getElementById("modAuthor").disabled=true;
          }
          else if (event.target == modalDesc) {
            modalDesc.style.display = "none";
            document.getElementById("modDesc").disabled=true;
          }
        }