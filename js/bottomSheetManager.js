const artworkTitle = document.querySelector('#artworkTitle')
const author = document.querySelector('#author')
const detail = document.querySelector('#detailName')
const description = document.querySelector("#description")
const audioGuide = document.querySelector('#audioGuide')
const restartButton = document.querySelector('#restart')


let voices = undefined;
const synth = window.speechSynthesis
const utterThis = new SpeechSynthesisUtterance()
setTimeout(() => {
    voices = synth.getVoices()
    utterThis.voice = voices[21];
    utterThis.lang = 'it-IT';
}, 100);


let ourText = ""

const checkBrowserCompatibility = () => {
    "speechSynthesis" in window
        ? console.log("Web Speech API supported!")
        : console.log("Web Speech API not supported :-(")
}

checkBrowserCompatibility()

let action = 1;

window.addEventListener('load', function () {
    action = 1;
})


audioGuide.addEventListener('click', function () {

    if (action == 1) {
        if (document.getElementById('Italian').href == window.location.href + '#') {
            restart.style.display = 'inline'
            ourText = "L'opera che stai guardando è "
            ourText = ourText.concat(artworkTitle.innerText)
            ourText = ourText.concat(' di ')
            ourText = ourText.concat(author.innerText)
            ourText = ourText.concat('. ed hai selezionato ')
            ourText = ourText.concat(detail.outerText)
            ourText = ourText.concat('. ')
            ourText = ourText.concat(description.outerText)
            let text = ourText.split(".")
            action = 2
            for (let i = 0; i < text.length; i++) {
                let utterance = new SpeechSynthesisUtterance(text[i])
                utterance.voice = voices.filter(function (voice) {
                    return voice.name == 'Google italiano';
                })[0];
                synth.speak(utterance)
            }
        } else {
            restart.style.display = 'inline'
            ourText = "You are in front of "
            ourText = ourText.concat(artworkTitle.innerText)
            ourText = ourText.concat(' by ')
            ourText = ourText.concat(author.innerText)
            ourText = ourText.concat(". and you have selected")
            ourText = ourText.concat(detail.outerText)
            ourText = ourText.concat('. ')
            ourText = ourText.concat(description.outerText)
            let text = ourText.split(".")
            action = 2
            for (let i = 0; i < text.length; i++) {
                let utterance = new SpeechSynthesisUtterance(text[i])
                utterance.voice = voices.filter(function (voice) {
                    return voice.lang == 'it-GB';
                })[0];
                synth.speak(utterance)
            }
        }
    } else if (action == 2) {
        synth.pause();
        restart.style.display = 'inline'
        action = 3
    } else {
        synth.resume();
        action = 2
    }

})

restartButton.addEventListener('click', function () {
    if (document.getElementById('Italian').href == window.location.href + '#') {
        synth.cancel()
        ourText = "L'opera che stai guardando è "
        ourText = ourText.concat(artworkTitle.innerText)
        ourText = ourText.concat(' di ')
        ourText = ourText.concat(author.innerText)
        ourText = ourText.concat('. ed hai selezionato .')
        ourText = ourText.concat(detail.outerText)
        ourText = ourText.concat('  . !')
        ourText = ourText.concat(description.outerText)
        let text = ourText.split(".")

        for (let i = 0; i < text.length; i++) {
            let utterance = new SpeechSynthesisUtterance(text[i])
            utterance.voice = voices.filter(function (voice) {
                return voice.name == 'Google italiano';
            })[0];
            synth.speak(utterance)
        }
    } else {
        synth.cancel()
        ourText = "You are in front of "
        ourText = ourText.concat(artworkTitle.innerText)
        ourText = ourText.concat(' by ')
        ourText = ourText.concat(author.innerText)
        ourText = ourText.concat(". and you have selected")
        ourText = ourText.concat(detail.outerText)
        ourText = ourText.concat('. ')
        ourText = ourText.concat(description.outerText)
        let text = ourText.split(".")
        for (let i = 0; i < text.length; i++) {
            let utterance = new SpeechSynthesisUtterance(text[i])
            utterance.voice = voices.filter(function (voice) {
                return voice.lang == 'it-GB';
            })[0];
            synth.speak(utterance)
        }
    }
    action = 2
})


window.onbeforeunload = function () {
    synth.cancel();
}


const $ = document.querySelector.bind(document)


const sheet = $("#sheet")
const sheetContents = sheet.querySelector(".contents")
const draggableArea = sheet.querySelector(".draggable-area")
const SmartLens = document.getElementById('SmartLens')
const scrollableArea = document.querySelector("#sheet .body")


let sheetHeight // in vh

const setSheetHeight = (value) => {
    sheetHeight = Math.max(0, Math.min(100, value))
    sheetContents.style.height = `${sheetHeight}vh`

    if (sheetHeight === 100) {
        sheetContents.classList.add("fullscreen")
        SmartLens.style.display = 'none'
    } else {
        sheetContents.classList.remove("fullscreen")
        SmartLens.style.display = 'block'
    }
}

const setIsSheetShown = (value) => {
    sheet.setAttribute("aria-hidden", String(!value))
    setSheetHeight(Math.min(16, 720 / window.innerHeight * 100));
    scrollableArea.scrollTo(0, 0)
}


// Hide the sheet when clicking the 'close' button
sheet.querySelector("#close-sheet").addEventListener("click", () => {
    setSheetHeight(Math.min(16, 720 / window.innerHeight * 100));
})


const touchPosition = (event) =>
    event.touches ? event.touches[0] : event

let dragPosition

const onDragStart = (event) => {
    dragPosition = touchPosition(event).pageY
    sheetContents.classList.add("not-selectable")
    draggableArea.style.cursor = document.body.style.cursor = "grabbing"
}

const onDragMove = (event) => {
    if (dragPosition === undefined) return

    const y = touchPosition(event).pageY
    const deltaY = dragPosition - y
    const deltaHeight = deltaY / window.innerHeight * 100

    setSheetHeight(sheetHeight + deltaHeight)
    dragPosition = y
}

const onDragEnd = () => {
    dragPosition = undefined
    sheetContents.classList.remove("not-selectable")
    draggableArea.style.cursor = document.body.style.cursor = ""

    if (sheetHeight < 16) {
        setIsSheetShown(false)
        synth.cancel()
        document.getElementById('audio').pause();
        document.getElementById('detailVideo').pause();
        action = 1
    } else if (sheetHeight > 75) {
        setSheetHeight(100)
    } else {
        setSheetHeight(50)
    }
}

draggableArea.addEventListener("mousedown", onDragStart)
draggableArea.addEventListener("touchstart", onDragStart)

window.addEventListener("mousemove", onDragMove)
window.addEventListener("touchmove", onDragMove)

window.addEventListener("mouseup", onDragEnd)
window.addEventListener("touchend", onDragEnd)


