var artwork;
var author;
var description;
var num=3;
var table="artworks";
var colTitle="title";
var colAuth="authore";
var colConf="confidence";
var colDesc="description";
var id;

  function getDetailsInfoJSON(detail_id, lang, table,req) {
    var name=document.getElementById("modTitle");
    var auth=document.getElementById("modAuthor");
    //var conf=document.getElementById("modConf");
    var desc=document.getElementById("modDesc");
    var det_src=document.getElementById("imgDetail");

            fetch('artworkView_json.php?id=' + detail_id + '&lang=' + lang + '&table=' + table+'&req=' + req)
                .then((response) => response.json())
                .then((data) => {
                        name.innerText = data[0]['title'];
                        //if(auth!=null)
                        if(document.cookie<=num)
                            auth.innerText = data[0]['author'];
                        else
                            auth.innerText = data[0]['confidence'];
                        /*else
                            conf.innerText = data[0]['confidence'];*/
                        desc.innerText = data[0]['description'];
                        det_src.src = data[0]['imgsrc'];
                    }
                );
        }
        
   //     window.onload=getDetailsInfoJSON(id,"en");
        // Get the modal
        var modalTitle = document.getElementById("modalTitle");
        var modalAuthor = document.getElementById("modalAuthor");
        //var modalConf = document.getElementById("modalConf");
        var modalDesc = document.getElementById("modalDesc");
        
        // Get the button that opens the modal
        var btnTitle = document.getElementById("btnTitle");
        var btnAuthor= document.getElementById("btnAuthor");
        //var btnConf= document.getElementById("btnConf");
        var btnDesc = document.getElementById("btnDesc");

        var saveTitle = document.getElementById("saveTitle");
        var saveAuthor = document.getElementById("saveAuthor");
        //var saveConf = document.getElementById("saveConf");
        var saveDesc = document.getElementById("saveDesc");
        
        // Get the <span> element that closes the modal
        var spanTitle = document.getElementsByClassName("close")[0];
        var spanAuthor = document.getElementsByClassName("close")[1];
       // var spanConf ="nullo";//document.getElementsByClassName("close")[1];
        var spanDesc = document.getElementsByClassName("close")[2];
        var modTitle = document.getElementsByClassName("mod")[0];
        var modAuthor = document.getElementsByClassName("mod")[1];
        //var modConf = "nullo";//document.getElementsByClassName("mod")[1];
        var modDesc = document.getElementsByClassName("mod")[2];

        btnTitle.onclick = function () {
            modalTitle.style.display = "block";
        }
        //if(btnAuthor!=null){
            btnAuthor.onclick = function () {
            modalAuthor.style.display = "block";
            }
        //}
        
        /*if(btnConf!=null){
            btnConf.onclick = function () {
            modalConf.style.display = "block";
            }
        }*/

        btnDesc.onclick = function () {
            modalDesc.style.display = "block";
        }

       
 




        // When the user clicks on <span> (x), close the modal
        spanTitle.onclick = function(){
            modalTitle.style.display = "none";
            document.getElementById("modTitle").disabled=true;
        }
       // if(spanAuthor!="nullo"){
            spanAuthor.onclick = function(){
                console.log(modAuthor);
                modalAuthor.style.display = "none";
                document.getElementById("modAuthor").disabled=true;
            }
       // }
     /*   if(spanConf!="nullo"){
            spanConf.onclick = function(){
                modalConf.style.display = "none";
                document.getElementById("modConf").disabled=true;
            }
        }*/
        spanDesc.onclick = function(){
            modalDesc.style.display = "none";
            document.getElementById("modDesc").disabled=true;
        }
        modTitle.onclick = function(){
            document.getElementById("modTitle").disabled=false;
        }

      // if(modAuthor!="nullo"){
            modAuthor.onclick = function(){
                if(modAuthor!="nullo"){
                document.getElementById("modAuthor").disabled=false;
            }
            }
      //  }
      /*  if(modConf!="nullo"){
            modConf.onclick = function(){
                document.getElementById("modConf").disabled=false;
            }
        }*/
        
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
         /* else if (event.target == modalConf) {
            modalConf.style.display = "none";
            document.getElementById("modConf").disabled=true;
          }*/
          else if (event.target == modalDesc) {
            modalDesc.style.display = "none";
            document.getElementById("modDesc").disabled=true;
          }
        }

        saveTitle.onclick = function(){
            var title=document.getElementById("modTitle");
            var data=title.value;
            saveData(data, id,table,colTitle);
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
            if (document.cookie<=num)
                saveData(data,id,table,colAuth);
            else
                saveData(data,id,table,colConf);
            auth.style.backgroundColor="#ecffde";
            auth.style.border="2px solid green";
            setTimeout(() => {  
                auth.style.backgroundColor="white";
                auth.style.border="1px solid black"; 
            }, 600);
            document.getElementById("modAuthor").disabled=true;
        }
            

        /*if(saveAuthor!=null){
        saveAuthor.onclick = function(){
            var auth=document.getElementById("modAuthor");
            var data=auth.value;
            saveData(data,id,table,colAuth);
            auth.style.backgroundColor="#ecffde";
            auth.style.border="2px solid green";
            setTimeout(() => {  
                auth.style.backgroundColor="white";
                auth.style.border="1px solid black"; 
            }, 600);
            document.getElementById("modAuthor").disabled=true;
        }
        }

        if(saveConf!=null){
        saveConf.onclick = function(){
            var conf=document.getElementById("modConf");
            var data=conf.value;
            saveData(data,id,table,colConf);
            conf.style.backgroundColor="#ecffde";
            conf.style.border="2px solid green";
            setTimeout(() => {  
                conf.style.backgroundColor="white";
                conf.style.border="1px solid black"; 
            }, 600);
            document.getElementById("modConf").disabled=true;
        }
        }*/

        saveDesc.onclick = function(){
            var desc=document.getElementById("modDesc");
            var data=desc.value;
            saveData(data,id,table,colDesc);
            desc.style.backgroundColor="#ecffde";
            desc.style.border="2px solid green";
            setTimeout(() => {  
                desc.style.backgroundColor="white";
                desc.style.border="1px solid black"; 
            }, 600);
            document.getElementById("modDesc").disabled=true;
        }

        function saveData (data, id, table,col){
            var request_type = "updateDetails";
            $.ajax({
                type: "POST",
                url: "server/actions.php",
                data: {
                    "action": request_type,
                    "data": data,
                    "id": id,
                    "table": table,
                    "col": col
                },
                async: false
                });
        }

        for(i=1;i<=num;i++){
            id=document.cookie;
            if(document.cookie==i)
                getDetailsInfoJSON(i,"en", "artworks",1);
        }

        if (document.cookie>num){
            id=document.cookie-num;
         /*   spanConf = document.getElementsByClassName("close")[1];
            modConf = document.getElementsByClassName("mod")[1];
            spanAuthor = "nullo";
            modAuthor = "nullo";*/
            table="details";
           /* document.getElementById("saveAuthor").id="saveConf";
            document.getElementById("modalAuthor").id="modalConf";
            document.getElementById("modAuthor").id="modConf";
            document.getElementById("btnAuthor").id="btnConf";*/
            getDetailsInfoJSON(document.cookie-num,"en", "details",1);
            document.getElementById("settDet").style.display="none";
        }


        home.onclick=function(){ 
            id=document.cookie;
           /* spanAuthor = document.getElementsByClassName("close")[1];
            modAuthor = document.getElementsByClassName("mod")[1];
            spanConf = "nullo";
            modConf = "nullo";*/
            table="artworks";
           /* document.getElementById("saveConf").id="saveAuthor";
            document.getElementById("modalConf").id="modalAuthor";
            document.getElementById("modConf").id="modAuthor";
            document.getElementById("btnConf").id="btnAuthor";*/
            document.cookie=1;
        }
  

        
        

        