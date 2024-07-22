var artwork;
var author;
var description;
var num=3;
var table="artworks";
var colTitle="title";
var colAuth="author";
var colConf="confidence";
var colDesc="description";
var id;
var english = document.getElementById("English");
const italian = document.getElementById("Italian");

  function getDetailsInfoJSON(detail_id, lang, table,req) {
    var name=document.getElementById("modTitle");
    var auth=document.getElementById("modAuthor");
    var desc=document.getElementById("modDesc");
    var det_src=document.getElementById("imgDetail");
    var label_actual=[];
        for(i=0;i<3;i++)
            label_actual[i]= document.getElementsByClassName("actual")[i];

            fetch('artworkView_json.php?id=' + detail_id + '&language=' + lang + '&table=' + table+'&req=' + req)
                .then((response) => response.json())
                .then((data) => {
                        name.innerText = data[0]['title'];
                        label_actual[0].innerText=data[0]['title'];
                        if(getCookie("details")==""){
                            auth.innerText = data[0]['author'];
                            label_actual[1].innerText=data[0]['author'];
                        }
                        else{
                            label_actual[1].innerText=data[0]['confidence'];
                            auth.innerText = data[0]['confidence'];
                        }
                        desc.innerText = data[0]['description'];
                        label_actual[2].innerText=data[0]['description'];
                        det_src.src = data[0]['imgsrc'];
                    }
                );
        }
        
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
        
        var label_actual=[];
        for(i=0;i<3;i++)
            label_actual[i]= document.getElementsByClassName("actual")[i];

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
                console.log(modAuthor);
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
            saveData(data, getCookie("details"),table,colTitle,getCookie("language"));
            title.style.backgroundColor="#ecffde";
            title.style.border="2px solid green";
            setTimeout(() => {  
                title.style.backgroundColor="white";
                title.style.border="1px solid black"; 
            }, 600);
            document.getElementById("modTitle").disabled=true;
        }
        

       
        saveAuthor.onclick = function(){
            var auth=document.getElementById("modAuthor",getCookie("language"));
            var data=auth.value;
            if (getCookie("details")==0)
                saveData(data,getCookie("artwork"),table,colAuth);
            else
                saveData(data,getCookie("details"),table,colConf,getCookie("language"));
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
            if (getCookie("details")==0)
                saveData(data,getCookie("artwork"),table,colDesc,getCookie("language"));
            else
                saveData(data,getCookie("details"),table,colDesc,getCookie("language"));
            desc.style.backgroundColor="#ecffde";
            desc.style.border="2px solid green";
            setTimeout(() => {  
                desc.style.backgroundColor="white";
                desc.style.border="1px solid black"; 
            }, 600);
            document.getElementById("modDesc").disabled=true;
        }

        function saveData (data, id, table,col,language){
            var request_type = "updateDetails";
            $.ajax({
                type: "POST",
                url: "server/actions.php",
                data: {
                    "action": request_type,
                    "data": data,
                    "id": id,
                    "table": table,
                    "col": col,
                    "language":language
                },
                async: false
                });
            if(getCookie("details")>0)
                getDetailsInfoJSON(getCookie("details"),getCookie("language"), "details",1);
        }


        if(getCookie("details")=="")
                getDetailsInfoJSON(getCookie("artwork"),getCookie("language"), "artworks",1);

        if(getCookie("details")>0){
            table="details";
           getDetailsInfoJSON(getCookie("details"),getCookie("language"), "details",1);
        }


        var home= document.getElementById("home");
        home.onclick=function(){ 
        table="artworks";
           deleteCookie("details");
           deleteCookie("artwork");
           window.location.href = './areaRiservata.html';
        }
  

       

        
        

        