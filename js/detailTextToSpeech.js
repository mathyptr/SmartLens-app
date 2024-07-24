let detail_action = 1;

window.addEventListener('load', function () {
    detail_action = 1;
})

document.addEventListener('DOMContentLoaded', function () {
    const detail_artworkTitle = document.querySelector('#detail_artworkTitle')
    const detail_author = document.querySelector('#detail_author')
    const detail_detailName = document.querySelector('#detail_detailName')
    const detail_description = document.querySelector("#detail_description")
    const detail_audioGuide = document.querySelector('#detail_audioGuide')


    detail_audioGuide.addEventListener('click', function () {
        if (!synth.speaking) {
            if (getCookie("language")=="it"){//(document.getElementById('Italian').href == window.location.href + '#') {
                let ourText = "L'opera che stai guardando è "
                ourText = ourText.concat(detail_artworkTitle.innerText)
                ourText = ourText.concat(' di ')
                ourText = ourText.concat(detail_author.innerText)
                ourText = ourText.concat('. ed hai selezionato ')
                ourText = ourText.concat(detail_detailName.outerText)
                ourText = ourText.concat('. ')
                ourText = ourText.concat(detail_description.outerText)
                let text = ourText.split(".")
                for (let i = 0; i < text.length; i++) {
                    let utterance = new SpeechSynthesisUtterance(text[i])
                    utterance.voice = voices.filter(function (voice) {
                        return voice.name == 'Google italiano';
                    })[0];
                    synth.speak(utterance)
                }
            } else {
                let ourText = "You are in front of "
                ourText = ourText.concat(detail_artworkTitle.innerText)
                ourText = ourText.concat(' by ')
                ourText = ourText.concat(detail_author.innerText)
                ourText = ourText.concat(". and you have selected ")
                ourText = ourText.concat(detail_detailName.outerText)
                ourText = ourText.concat('. ')
                ourText = ourText.concat(detail_description.outerText)
                let text = ourText.split(".")
                for (let i = 0; i < text.length; i++) {
                    let utterance = new SpeechSynthesisUtterance(text[i])
                    utterance.voice = voices.filter(function (voice) {
                        return voice.lang == 'it-GB';
                    })[0];
                    synth.speak(utterance)
                }
            }
        }

    })


})

window.onbeforeunload = function () {
    synth.cancel();
}


