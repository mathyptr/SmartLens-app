var artwork;
var author;
var description;

  function getDetailsInfoJSON(detail_id, lang) {
    var name=document.getElementById("modTitle");
    var auth=document.getElementById("modAuthor");
    var desc=document.getElementById("modDesc");

            fetch('artworkView_json.php?id=' + detail_id + '&lang=' + lang)
                .then((response) => response.json())
                .then((data) => {
                        name.innerText = data[0]['title'];
                        auth.innerText = data[0]['author'];
                        desc.innerText = data[0]['description'];
                    }
                );
        }
        
   //     window.onload=getDetailsInfoJSON(id,"en");
        // Get the modal
        var modalTitle = document.getElementById("modalTitle");
        var modalAuthor = document.getElementById("modalAuthor");
        var modalDesc = document.getElementById("modalDesc");
        
        // Get the button that opens the modal
        var btnTitle = document.getElementById("btnTitle");
        var btnAuthor= document.getElementById("btnAuthor");
        var btnDesc = document.getElementById("btnDesc");

        var saveTitle = document.getElementById("saveTitle");
        var saveAuthor = document.getElementById("saveAuthor");
        var saveDesc = document.getElementById("saveDesc");
        
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
            //var name=document.getElementById("modTitle");
           // name.innerText=artwork;
        }
        btnAuthor.onclick = function () {
            modalAuthor.style.display = "block";
           // var auth=document.getElementById("modAuthor");
           // auth.innerText=author;
        }
        btnDesc.onclick = function () {
            modalDesc.style.display = "block";
          //  var desc=document.getElementById("modDesc");
           // desc.innerText=description;
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

        saveTitle.onclick = function(){
            var title=document.getElementById("modTitle");
            var data=title.value;
            saveData(1,data, document.cookie);
            title.style.backgroundColor="#ecffde";
            title.style.border="2px solid green";
            setTimeout(() => {  
                title.style.backgroundColor="white";
                title.style.border="1px solid black"; 
            }, 600);
            document.getElementById("modTitle").disabled=true;
        }
          
        saveAuthor.onclick = function(){
            var auth=document.getElementById("modAuthor");
            var data=auth.value;
            saveData(2,data,document.cookie);
            auth.style.backgroundColor="#ecffde";
            auth.style.border="2px solid green";
            setTimeout(() => {  
                auth.style.backgroundColor="white";
                auth.style.border="1px solid black"; 
            }, 600);
            document.getElementById("modAuthor").disabled=true;
        }

        saveDesc.onclick = function(){
            var desc=document.getElementById("modDesc");
            var data=desc.value;
            saveData(3,data,document.cookie);
            desc.style.backgroundColor="#ecffde";
            desc.style.border="2px solid green";
            setTimeout(() => {  
                desc.style.backgroundColor="white";
                desc.style.border="1px solid black"; 
            }, 600);
            document.getElementById("modDesc").disabled=true;
        }

        function saveData (type,data, id){
            var request_type = "updateDetails";
            $.ajax({
                type: "POST",
                url: "server/actions.php",
                data: {
                    "action": request_type,
                    "data": data,
                    "type": type,
                    "id": id
                },
                async: false
                });
        }

        if(document.cookie==1){
            getDetailsInfoJSON(1,"en");
            document.getElementById("imgDetail").src="./images/Venere_botticelliEx.jpg";
        }
            
        else if(document.cookie==2){
            getDetailsInfoJSON(2,"en");
            document.getElementById("imgDetail").src="./images/Duchi_UrbinoEx.jpg";
        }
            
        else if(document.cookie==3){
            getDetailsInfoJSON(3,"en");
            document.getElementById("imgDetail").src="./images/Annunciazione.jpg";
        }
            
      