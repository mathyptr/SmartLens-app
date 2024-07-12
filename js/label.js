const title= "ReInHerit Smart Lens";
const btn_try="Try the interactive guide";
const intro="Try Smart Lens now! Using this interactive guide you will receive information about artwork and artwork details that you are looking at. You just need to frame it on your smartphone!";
const more_info="Click on details for more information";
const listen_guide="Listen the audio guide";
const btn_restart="restart";

len="en";

function setLabel(){
    const label_title = document.getElementById('title');
    const label_btn_try = document.getElementById('toCamera');
    const label_intro = document.getElementById('intro');
    const label_more_info= document.getElementById('more_info');
    const label_listen_guide= document.getElementById('listenGuide');
    const label_btn_restart= document.getElementById('restart');
    label_btn_try.innerText=btn_try;
    label_intro.innerText=intro;
    label_more_info.innerText=more_info;
    label_listen_guide.innerText=listen_guide;
    label_btn_restart.innerText=btn_restart;
}
