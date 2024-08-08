//const default_lan="en";
const en = document.getElementById("English");
const it = document.getElementById("Italian");
var path= "Home";
const n=3; //numero opere nel db
var num=0;
var idDet=[];
var id;

//label per index.html
var btn_try;
var intro;
var more_info;
var listen_guide;
var btn_restart;
var res;

//label per settings.html
var section_title;
var btn_title;
var btn_author;
var btn_desc;
var btn_conf;
var home;
var det;
var listDet;

//label per areaRiservata.html
var txt;
var artworks=[];
var msg;
var addFile;
var uploadFile;

//guardare se serve o se basta la label listen_guide
var listen;


const label_link_home = document.getElementById('linkHome');
const label_list_details = document.getElementById('listDetails');
//const label_btn_try = document.getElementsByClassName('toCamera');
const label_intro = document.getElementById('intro');
const label_more_info= document.getElementById('more_info');
const label_listen_guide= document.getElementById('listenGuide');
const label_btn_restart= document.getElementById('restart');
const label_res= document.getElementById('res');
const label_exit= document.getElementById('exit');


//const label_section_title= document.getElementById('sectionTitle');
const label_btn_title= document.getElementById('btnTitle');
const label_btn_author= document.getElementById('btnAuthor');
const label_btn_desc= document.getElementById('btnDesc');
//const label_btn_conf= document.getElementById('btnConf');
var modalRem = [];

//for(i=0;i<n+1;i++)
//    modalRem[i]= document.getElementsByClassName("modalRem")[i];

var spanRem = [];
//for(i=0;i<n+1;i++)
   // spanRem[i]= document.getElementsByClassName("cancel")[i];

var add= document.getElementById('btnAdd');

const label_home= document.getElementById('home');
//const label_det=document.getElementById('settDet');
    
const label_listen = document.getElementById('ascoltaGuida');

//const label_txt= document.getElementById('mytxt');
const label_artworks=[];

//for(i=0;i<n;i++)
  //  label_artworks[i]= document.getElementsByClassName("paintTitle")[i];

var label_remove=[];
//for(i=0;i<n;i++)
    //label_remove[i]= document.getElementsByClassName("remove")[i];

var label_msg=[];
//for(i=0;i<n;i++)
 //   label_msg[i]= document.getElementsByClassName("modRem")[i];

var label_for_actual=[];
for(i=0;i<n;i++)
    label_for_actual[i]= document.getElementsByClassName("labelActual")[i];

var label_btn_try=[];
for(i=0;i<10;i++)
    label_btn_try[i]= document.getElementsByClassName("toCamera")[i];

var label_det=[];
for(i=0;i<10;i++)
    label_det[i]= document.getElementsByClassName("settDet")[i];


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



function backToIndex(){
    if(getCookie("artwork")=="")
       ;// console.log("ok");
    else
        window.location.href = './index.html';
};


function createPaint(){

    var divModalRem = document.createElement("div");
    divModalRem.className="modal modalRem";
    var divRem = document.createElement("div");
    divRem.className="modal-content rem";
    var pRem = document.createElement("p");
    pRem.className="modRem";
    pRem.style.disabled;
    var divCont = document.createElement("div");
    divCont.className="ctaContainer";
    var spanOk= document.createElement("span");
    spanOk.className="material-symbols-outlined confirm";
    spanOk.innerText="done_outline";
    var spanRem= document.createElement("span");
    spanRem.className="material-symbols-outlined cancel";
    spanRem.innerText="disabled_by_default";
    
    divCont.appendChild(spanOk);
    divCont.appendChild(spanRem);
    divRem.appendChild(pRem);
    divRem.appendChild(divCont);
    divModalRem.appendChild(divRem);
    document.body.appendChild(divModalRem);
       

var div = document.createElement("div");
div.className="overflow-hidden";
var p = document.createElement("p");
p.className="remove";
var span= document.createElement("span");
span.className="material-symbols-outlined";
span.innerText="delete";
var listItem = document.createElement("div");
listItem.className="listItem";
var paint = document.createElement("p");
paint.className="paintTitle";

p.appendChild(span);
div.appendChild(p);
div.appendChild(listItem);
div.appendChild(paint);
document.getElementById("myList").appendChild(div);
};



function getDetailsInfoJSON(detail_id, lang, table,req) {
var myimg=[];
var myfocus=[];
fetch('artworkView_json.php?id=' + detail_id + '&language=' + lang+ '&table=' + table+'&req=' + req)
        .then((response) => response.json())
        .then((data) => {

            for(i=0;i<data.length;i++){
                var j,z;
                z=i+1;
                if(data.length>num)
                    createPaint();
                label_artworks[i]= document.getElementsByClassName("paintTitle")[i]; 
                label_remove[i]= document.getElementsByClassName("remove")[i];
                label_msg[z]= document.getElementsByClassName("modRem")[z];
                label_msg[z].innerText=msg;
                label_remove[i].id="rem"+z;
                modalRem[z]= document.getElementsByClassName("modalRem")[z];
                label_remove[i].addEventListener("click", function (){
                    j=(this.getAttribute('id')).substring(3);
                    modalRem[j].style.display = "block";
                    label_msg[j].disabled=false;
                });

                spanRem[z]= document.getElementsByClassName("cancel")[z];
                spanRem[z].id="span"+z;
                spanRem[z].addEventListener("click", function (){
                    j=(this.getAttribute('id')).substring(4);
                    modalRem[j].style.display = "none";
                    label_msg[j].disabled=true;
                });

                myimg[i]=document.getElementsByClassName("overflow-hidden")[i];  
                myfocus[i]=document.getElementsByClassName("listItem")[i];   
                if(getCookie("details")=="")
                    label_artworks[i].id=i+1;
                else
                    label_artworks[i].id=data[i]['id'];
                label_artworks[i].innerText = data[i]['title'];
                label_artworks[i].addEventListener("click", function (){
                    if(getCookie("details")=="")
                        setCookie("artwork",this.getAttribute('id'),1);
                      else{ 
                        getDetailsInfoJSON(getCookie("artwork"),"en", "details",2);
                        id=idDet[i];
                        setCookie("details",this.getAttribute('id'),1); 
                    }
                  window.location.href = './settings.html';
                });
                myimg[i].style.backgroundImage ="url("+data[i]['imgsrc']+")";
                myfocus[i].style.backgroundImage ="url("+data[i]['imgsrc']+")";
                }
                num=data.length;
        }
    ).catch(error => backToIndex());
    
}






function getDescJSON(detail_id, lang, table,req) {
    
    fetch('artworkView_json.php?id=' + detail_id + '&language=' + lang + '&table=' + table+'&req=' + req)
                .then((response) => response.json())
                .then((data) => {
                    document.getElementById("modDesc").innerText = data[0]['description'];
                    document.getElementsByClassName("actual")[2].innerText=data[0]['description'];
                    }
                ).catch(error => backToIndex());
}


function getPathJSON(id, lang, table,req,name) {
    fetch('artworkView_json.php?id=' + id + '&language=' + lang + '&table=' + table+'&req=' + req)
    .then((response) => response.json())
                .then((data) => {
                    document.getElementById(name).innerText ="/ "+data[0]['title'];
                    }
                );//.catch(error => backToIndex());
}




function setEn (){
//label per index.html
btn_try="Try the interactive guide";
intro="Click on an artwork to try Smart Lens now! Using this interactive guide you will receive information about artwork and artwork details that you are looking at. You just need to frame it on your smartphone!";
more_info="Click on details for more information";
listen_guide="Listen the audio guide";
btn_restart="Restart";
res="Reservered area";

//label per settings.html
section_title="Settings section";
btn_title="Title";
btn_author="Author";
btn_desc="Description";
home = "Home";
det ="Go to details";
btn_conf="Confidence";
listDet="/ List details";

//label per areaRiservata.html
txt="List of artworks";
msg="Are you sure you want to delete this artwork?";
add_file="Choose file";

//guardare se serve o se basta la label listen_guide
listen="Ascolta la guida";
}

function setIt (){
    //label per index.html
    btn_try="Attiva la guida interattiva";
    intro="Clicca su un'opera per provare Smart Lens! Con questa guida potrai ricevere informazioni relative alle opere e ai loro dettagli semplicemente inquadrandoli con il tuo smartphone!";
    more_info="Clicca sui dettagli per ricevere informazioni";
    listen_guide="Ascolta la guida";
    btn_restart="Restart";
    res="Area riservata";

    //label per settings.html
    section_title="Sezione modifiche";
    btn_title="Titolo";
    btn_author="Autore";
    btn_desc="Descrizione";
    home = "Home";
    det ="Vai ai dettagli";
    btn_conf="Confidenza";
    listDet="/ Elenco dettagli";

    //label per areaRiservata.html
    txt="Lista delle opere";
    msg="Vuoi davvero eliminare questa opera?";
    add_file="Scegli file";
    //guardare se serve o se basta la label listen_guide
    listen="Ascolta la guida";
}

//window.onload= setLabel("");

window.onload= setLabel("");

function update(){
    if(getCookie("details")=="")
        getDetailsInfoJSON(1,getCookie("language"),"artworks",3);
    else if (getCookie("details")==0)
        getDetailsInfoJSON(getCookie("artwork"),getCookie("language"), "details",2);
}

function setLabel(){
    if ((getCookie("language")=="en")){
        if(en!=null){
            en.style.borderBottom="2px solid black";
            it.style.borderBottom="2px solid transparent";
        }
        setEn();
    }
    else{
        if(it!=null){
            it.style.borderBottom="2px solid black";
            en.style.borderBottom="2px solid transparent";
        }  
        setIt();
    }
    
     if(label_link_home!=null)
        label_link_home.innerText=path;
       
    if(label_btn_try[0]!=null){ //label per index.html
        for(i = 0; i < 10; i++){
            label_btn_try[i].innerText=btn_try;
        }
        label_intro.innerText=intro;
       // label_res.innerText=res;
    }

    if(label_more_info!=null){ //label per mycamera-view_json.html
        label_more_info.innerText=more_info;
        label_listen_guide.innerText=listen_guide;
        label_btn_restart.innerText=btn_restart;
    }
    
    if( label_for_actual[0]!=null){ //label per settings.html
       // label_section_title.innerText=section_title;
        //label_btn_title.innerText=btn_title;
       // label_btn_desc.innerText=btn_desc;
        label_for_actual[0].innerText=btn_title+": ";
        label_for_actual[2].innerText=btn_desc+": ";
        //label_home.innerText=home;
        for(i = 0; i < 10; i++)
            label_det[i].innerText=det;
        if(getCookie("details")==""){
          //  label_btn_author.innerText=btn_author;
            label_for_actual[1].innerText=btn_author+": ";
        }
        else{
          //  label_btn_author.innerText=btn_conf;
            label_for_actual[1].innerText=btn_conf+": "
           // getDetailsInfoJSON(getCookie("details"),"en", "details",2);
        }
        if(getCookie("language")=="en"){
            en.style.borderBottom="2px solid black";
            it.style.borderBottom="2px solid transparent";
        }
        else{
            it.style.borderBottom="2px solid black";
            en.style.borderBottom="2px solid transparent";
        }
        //if(getCookie("details")!="")
           // label_list_details.innerText=listDet;
    }
    var list=document.getElementById("myList");
    if(list!=null){ //label per areaRiservata.html
       // label_txt.innerText=txt;
        update();
        /*if(getCookie("details")=="")
            getDetailsInfoJSON(1,getCookie("language"),"artworks",3);
        else if (getCookie("details")==0)
            getDetailsInfoJSON(getCookie("artwork"),getCookie("language"), "details",2);*/
   }
   

    if(label_link_home!=null){
        var x = window.matchMedia("(max-width: 800px)");
        if (x.matches){}// If media query matches} 
        else{
         if(getCookie("artwork")>0)
             getPathJSON(getCookie("artwork"), getCookie("language"), "artworks",1,"artName");
         if(getCookie("details")!="")
             label_list_details.innerText=listDet;
         if(getCookie("details")>0)
            getPathJSON(getCookie("details"), getCookie("language"), "details",1,"detName");
         }
    }
    
    /*if(label_msg[0]!=null){
        for(i=0;i<n;i++)
            label_msg[i].innerText=msg;
    }*/
   

    //guardare se serve o se basta la label listen_guide
    if(label_listen!=null){
        label_listen.innerText=listen;
    }
}
 
    if(it!=null){
        it.onclick= function () { 
            setCookie("language","it",1);
            setLabel();
            it.style.borderBottom="2px solid black";
            en.style.borderBottom="2px solid transparent";
            getInfo();
        }
    
        en.onclick= function () { 
            setCookie("language","en",1);
            setLabel();
            en.style.borderBottom="2px solid black";
            it.style.borderBottom="2px solid transparent";
            getInfo();
        }
    }


    function getInfo(){
        if(getCookie("details")=="")
            getDescJSON(getCookie("artwork"),getCookie("language"), "artworks",1);

       if(getCookie("details")>0){
        table="details";
        getDescJSON(getCookie("details"),getCookie("language"), "details",1);
    }
    }

    var focus=document.getElementById("focusImg");

   if(focus!=null){
    focus.onclick=function(){
        if(getCookie("details")=="")
            setCookie("details",0,1);
        else if(getCookie("details")>0)
            setCookie("details",0,1);
            
        window.location.href = './areaRiservata.html';
    }
   }

   if(label_res!=null){
        label_res.onclick=function(){
       // window.location.href = './areaRiservata.html';
       window.location.href = './login.php'
        }
    }

  /* if(label_res!=null){
        label_res.onclick=function(){
        window.location.href = './areaRiservata.html';
        }
    }*/
    
    if(label_exit!=null){
        label_exit.onclick=function(){
        //window.location.href = './index.html';
        window.location.href = './logout.php'
        }
    }


   /* if(label_artworks[0]!=null){
        label_artworks[0].onclick= function(){ 
            if(getCookie("details")=="")
                setCookie("artwork",1,1);
            else{ 
               getDetailsInfoJSON(getCookie("artwork"),getCookie("language"), "details",2);
                //getDetailsInfoJSON(idDet[0],"en", "details",1);
                id=idDet[0];
                setCookie("details",id,1);
            }
            window.location.href = './settings.html';
        }

        label_artworks[1].onclick= function(){ 
            if(getCookie("details")=="")
                setCookie("artwork",2,1);
            else{ 
                getDetailsInfoJSON(getCookie("artwork"),getCookie("language"), "details",2);
                id=idDet[1];
                //getDetailsInfoJSON(getCookie("artwork"),"en", "details",2);
                setCookie("details",id,1);
            }
            window.location.href = './settings.html';
        }

        label_artworks[2].onclick= function(){ 
            if(getCookie("details")=="")
                setCookie("artwork",3,1);
            else{ 
                getDetailsInfoJSON(getCookie("artwork"),"en", "details",2);
                id=idDet[2];
                setCookie("details",id,1);
            }
            window.location.href = './settings.html';
        }
    
        label_remove[0].onclick= function(){
            modalRem[0].style.display = "block";
            document.getElementsByClassName("modRem")[0].disabled=false;
        }
        
        label_remove[1].onclick= function(){ 
            modalRem[1].style.display = "block";
            document.getElementsByClassName("modRem")[1].disabled=false;
        }

        label_remove[2].onclick= function(){ 
            modalRem[2].style.display = "block";
            document.getElementsByClassName("modRem")[2].disabled=false;
        }

    }*/

    /*if(spanRem[0]!=null){
        spanRem[0].onclick = function(){
            modalRem[0].style.display = "none";
            document.getElementsByClassName("modRem")[0].disabled=true;
        }
    }
    if(spanRem[1]!=null){
            spanRem[1].onclick = function(){
                modalRem[1].style.display = "none";
                document.getElementsByClassName("modRem")[1].disabled=true;
    }
    }
    if(spanRem[2]!=null){
        spanRem[2].onclick = function(){
            modalRem[2].style.display = "none";
            document.getElementsByClassName("modRem")[2].disabled=true;
        }        
    }*/
    
    spanRem[0]= document.getElementsByClassName("cancel")[0];
    modalRem[0]= document.getElementsByClassName("modalRem")[0];
    if(spanRem[0]!=null){
        spanRem[0].onclick = function(){
            modalRem[0].style.display = "none";
            document.getElementsByClassName("modRem")[0].disabled=true;
        }        
    }

    if(add!=null){
        add.onclick = function(){
            modalRem[0].style.display = "block";
            document.getElementsByClassName("modRem")[0].disabled=false;
            update();
        }
    }

    if(label_link_home!=null){
        label_link_home.onclick=function(){ 
            table="artworks";
               deleteCookie("details");
               deleteCookie("artwork");
               window.location.href = './areaRiservata.html';
        }
    }
    
     
    var artName=document.getElementById("artName"); 
    var list=document.getElementById("listDetails"); 
    if(label_exit!=null){
    artName.onclick=function(){
        if(getCookie("details")!=""){
            setCookie("details","",1); 
            window.location.href = './settings.html';
        }
    }
    list.onclick=function(){
        if(getCookie("details")>0){
            setCookie("details",0,1);
            window.location.href = './areaRiservata.html';
        }
    }
}







    function getArtwork (id){
        var request_type = "getArtwork";
        var tmp = null;
        $.ajax({
            type: "POST",
            url: "server/actions.php",
            async: true,
            data: {
                "action": request_type,
                "id": id
            },
            dataType: "json",
            //headers: {"Content-type" :"application/x-www-form-urlencoded"},
            success: function (data) {
                tmp = data;
                return data;
            },
        });
        if (tmp == null)
            alert('Can not connect to Smart Lens database!')
        return tmp;
    };




          

        