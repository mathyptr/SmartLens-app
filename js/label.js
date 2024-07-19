const default_lan="en";
const en = document.getElementById("English");
const it = document.getElementById("Italian");
const title= "ReInHerit Smart Lens";
const n=3; //numero opere nel db
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

//label per areaRiservata.html
var txt;
var artworks=[];

//guardare se serve o se basta la label listen_guide
var listen;


const label_title = document.getElementById('title');
const label_btn_try = document.getElementById('toCamera');
const label_intro = document.getElementById('intro');
const label_more_info= document.getElementById('more_info');
const label_listen_guide= document.getElementById('listenGuide');
const label_btn_restart= document.getElementById('restart');
const label_res= document.getElementById('res');
const label_exit= document.getElementById('exit');

const label_section_title= document.getElementById('sectionTitle');
const label_btn_title= document.getElementById('btnTitle');
const label_btn_author= document.getElementById('btnAuthor');
const label_btn_desc= document.getElementById('btnDesc');
//const label_btn_conf= document.getElementById('btnConf');

const label_home= document.getElementById('home');
const label_det=document.getElementById('settDet');
    
const label_listen = document.getElementById('ascoltaGuida');

const label_txt= document.getElementById('mytxt');
const label_artworks=[];

for(i=0;i<n;i++)
    label_artworks[i]= document.getElementsByClassName("paintTitle")[i];

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

/*function getDetailsInfoJSON(detail_id, lang, table,req) {
    var myimg=document.getElementsByClassName("overflow-hidden")[detail_id-1];   
    var myfocus=document.getElementsByClassName("listItem")[detail_id-1];   
    fetch('artworkView_json.php?id=' + detail_id + '&lang=' + lang+ '&table=' + table+'&req=' + req)
        .then((response) => response.json())
        .then((data) => {
            label_artworks[detail_id-1].innerText = data[0]['title'];
            //if(myimg!=null){
                myimg.style.backgroundImage ="url("+data[0]['imgsrc']+")";
                myfocus.style.backgroundImage ="url("+data[0]['imgsrc']+")";
          //  }         
            }
        );
}*/

function getDetailsInfoJSON(detail_id, lang, table,req) {
var myimg=[];
var myfocus=[];
for(i=0;i<n;i++){
myimg[i]=document.getElementsByClassName("overflow-hidden")[i];   
myfocus[i]=document.getElementsByClassName("listItem")[i];   
}
fetch('artworkView_json.php?id=' + detail_id + '&lang=' + lang+ '&table=' + table+'&req=' + req)
        .then((response) => response.json())
        .then((data) => {
           // for(i=0;i<n;i++){
            for(i=0;i<data.length;i++){
            idDet[i]=data[i]['id'];
            label_artworks[i].innerText = data[i]['title'];
            myimg[i].style.backgroundImage ="url("+data[i]['imgsrc']+")";
            myfocus[i].style.backgroundImage ="url("+data[i]['imgsrc']+")";
            }
        }
    );
}


/*function getDetailsInfoJSON(detail_id, lang) {
    return fetch('artworkView_json.php?id=' + detail_id + '&lang=' + lang).then(function(response) {
        return response.json();
    }).then(function(json) {
        return json;
    });
}*/


function setEn (){
//label per index.html
btn_try="Try the interactive guide";
intro="Try Smart Lens now! Using this interactive guide you will receive information about artwork and artwork details that you are looking at. You just need to frame it on your smartphone!";
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

//label per areaRiservata.html
txt="List of artworks";

//guardare se serve o se basta la label listen_guide
listen="Ascolta la guida";
}

function setIt (){
    //label per index.html
    btn_try="Attiva la guida interattiva";
    intro="Prova Smart Lens! Con questa guida potrai ricevere informazioni relative alle opere e ai loro dettagli semplicemente inquadrandoli con il tuo smartphone!";
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

    //label per areaRiservata.html
    txt="Lista delle opere";

    //guardare se serve o se basta la label listen_guide
    listen="Ascolta la guida";
}

//window.onload= setLabel("");

window.onload= setLabel("");

function setLabel(language){
    
    if ((default_lan=="en")&&(language!="it"))
        setEn();


    if(label_btn_try!=null){ //label per index.html
        label_btn_try.innerText=btn_try;
        label_intro.innerText=intro;
       // label_res.innerText=res;
    }

    if(label_more_info!=null){ //label per mycamera-view_json.html
        label_more_info.innerText=more_info;
        label_listen_guide.innerText=listen_guide;
        label_btn_restart.innerText=btn_restart;
    }
    
    if(label_section_title!=null){ //label per settings.html
        label_section_title.innerText=section_title;
        label_btn_title.innerText=btn_title;
        label_btn_desc.innerText=btn_desc;
        //label_home.innerText=home;
        //label_det.innerText=det;
        if(getCookie("details")=="")
            label_btn_author.innerText=btn_author;
        else{
            label_btn_author.innerText=btn_conf;
            getDetailsInfoJSON(id,"en", "details",2);
        }
            
    }
    
    if(label_txt!=null){ //label per areaRiservata.html
        label_txt.innerText=txt;
        if(getCookie("details")=="")
            getDetailsInfoJSON(1,"en","artworks",3);
        else
            getDetailsInfoJSON(getCookie("artwork"),"en", "details",2);
           
    }



    //guardare se serve o se basta la label listen_guide
    if(label_listen!=null){
        label_listen.innerText=listen;
    }
}
 
    if(it!=null){
        it.onclick= function () { 
            setIt(); 
            setLabel("it");
            it.style.borderBottom="2px solid black";
            en.style.borderBottom="0px";
        }
    
        en.onclick= function () { 
            setIt(); 
            setLabel("en");
            en.style.borderBottom="2px solid black";
            it.style.borderBottom="0px";
        }
    }

   if(label_det!=null){
    label_det.onclick=function(){
        if(getCookie("details")=="")
            setCookie("details",0,1);
        else if(getCookie("details")>0)
            setCookie("details",0,1);
            
        window.location.href = './areaRiservata.html';
    }
   }

   if(label_res!=null){
        label_res.onclick=function(){
        window.location.href = './areaRiservata.html';
        }
    }

    if(label_res!=null){
        label_res.onclick=function(){
        window.location.href = './areaRiservata.html';
        }
    }
    
    if(label_exit!=null){
        label_exit.onclick=function(){
        window.location.href = './index.html';
        }
    }


    if(label_artworks[0]!=null){
        label_artworks[0].onclick= function(){ 
            if(getCookie("details")=="")
                setCookie("artwork",1,1);
            else{ 
               getDetailsInfoJSON(getCookie("artwork"),"en", "details",2);
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
                getDetailsInfoJSON(getCookie("artwork"),"en", "details",2);
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


    
