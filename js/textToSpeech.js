const artworkTitle = document.querySelector('#artworkTitle')
const author = document.querySelector('#author')
const detail = document.querySelector('#detailName')
const description = document.querySelector("#description")
const audioGuide = document.querySelector('#audioGuide')
const restartButton = document.querySelector('#restart')



const synth = window.speechSynthesis
const utterThis = new SpeechSynthesisUtterance()
setTimeout(() => {
    console.log(window.speechSynthesis.getVoices());
    const voices = synth.getVoices()
    utterThis.voice = voices[21];
    utterThis.lang = 'it-IT';
}, 10);


let ourText = ""

const checkBrowserCompatibility = () => {
    "speechSynthesis" in window
        ? console.log("Web Speech API supported!")
        : console.log("Web Speech API not supported :-(")
}

checkBrowserCompatibility()

var action = 1;


audioGuide.addEventListener('click', function (){
    if(action == 1){
        restart.style.display = 'inline'
        ourText = "L'opera che stai guardando è "
        ourText = ourText.concat(artworkTitle.innerText)
        ourText = ourText.concat(' di ')
        ourText = ourText.concat(author.innerText)
        ourText = ourText.concat('. e il particolare selezionato è ')
        ourText = ourText.concat(detail.outerText)
        ourText = ourText.concat('  . ! . !')
        ourText = ourText.concat(description.outerText)

        utterThis.text = ourText
        synth.speak(utterThis)
        action = 2
    }
    else if(action == 2){
        synth.pause();
        restart.style.display = 'inline'
        action = 3
    } else {
        synth.resume();
        action = 2
    }

})

restartButton.addEventListener('click', function (){
    synth.cancel()
    ourText = "L'opera che stai guardando è "
    ourText = ourText.concat(artworkTitle.innerText)
    ourText = ourText.concat(' di ')
    ourText = ourText.concat(author.innerText)
    ourText = ourText.concat('. e il particolare selezionato è ')
    ourText = ourText.concat(detail.outerText)
    ourText = ourText.concat('  . ! . !')
    ourText = ourText.concat(description.outerText)

    utterThis.text = ourText
    synth.speak(utterThis)
    synth.speak(utterThis)
    action = 2
})


