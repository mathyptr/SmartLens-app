const default_lan="en";
const en = document.getElementById("English");
const it = document.getElementById("Italian");
const title= "ReInHerit Smart Lens";
const n=3; //numero opere nel db

//label per index.html
var btn_try;
var intro;
var more_info;
var listen_guide;
var btn_restart;

//label per settings.html
var section_title;
var btn_title;
var btn_author;
var btn_desc;

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

const label_section_title= document.getElementById('sectionTitle');
const label_btn_title= document.getElementById('btnTitle');
const label_btn_author= document.getElementById('btnAuthor');
const label_btn_desc= document.getElementById('btnDesc');
    
const label_listen = document.getElementById('ascoltaGuida');

const label_txt= document.getElementById('mytxt');
const label_artworks=[];


function setEn (){
//label per index.html
btn_try="Try the interactive guide";
intro="Try Smart Lens now! Using this interactive guide you will receive information about artwork and artwork details that you are looking at. You just need to frame it on your smartphone!";
more_info="Click on details for more information";
listen_guide="Listen the audio guide";
btn_restart="Restart";

//label per settings.html
section_title="Settings section";
btn_title="Title";
btn_author="Author";
btn_desc="Description";

//label per areaRiservata.html
txt="List of artworks";
artworks=["Venere di Botticelli", "Venere di Botticelli", "Venere di Botticelli"];

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

    //label per settings.html
    section_title="Sezione modifiche";
    btn_title="Titolo";
    btn_author="Autore";
    btn_desc="Descrizione";

    //label per areaRiservata.html
    txt="Lista delle opere";
    artworks=["Venere di Botticelli", "Venere di Botticelli", "Venere di Botticelli"];

    //guardare se serve o se basta la label listen_guide
    listen="Ascolta la guida";
}

window.onload=setLabel("");

function setLabel(language){
    if ((default_lan=="en")&&(language!="it"))
        setEn();

    for(i=0;i<n;i++)
    label_artworks[i]= document.getElementsByClassName("paintTitle")[i];

    if(label_btn_try!=null){ //label per index.html
        label_btn_try.innerText=btn_try;
        label_intro.innerText=intro;
    }

    if(label_more_info!=null){ //label per mycamera-view_json.html
        label_more_info.innerText=more_info;
        label_listen_guide.innerText=listen_guide;
        label_btn_restart.innerText=btn_restart;
    }
    
    if(label_section_title!=null){ //label per settings.html
        label_section_title.innerText=section_title;
        label_btn_title.innerText=btn_title;
        label_btn_author.innerText=btn_author;
        label_btn_desc.innerText=btn_desc;
    }

    if(label_txt!=null){ //label per areaRiservata.html
        label_txt.innerText=txt;
        for(i=0;i<n;i++)
            label_artworks[i].innerText=artworks[i];
    }

    //guardare se serve o se basta la label listen_guide
    if(label_listen!=null){
        label_listen.innerText=listen;
    }
   
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

