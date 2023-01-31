let version = 4; //Cambia valore a 2 per ottenere la versione con 5 descrittori

//Caricamento dei dati da database e del modello
let detailIDs = undefined;
let details = undefined;
let model = undefined;

await (function ($) {
    console.log("jQuery" + $);
    $.fn.getDetailFromWebcam = async function (options) {
        try {
            var $this = $(this);

            detailIDs = await function getDetailsIDs() {

                var request_type = "getDetailIDs";
                var tmp = null;
                $.ajax({
                    url: options.serverURL,
                    type: "POST",
                    async: false,
                    //contentType: 'application/json; charset=utf-8',
                    data: {
                        "action": request_type,
                        "version": version
                    },
                    dataType: "json",
                    //headers: {"Content-type" :"application/x-www-form-urlencoded"},
                    success: function (data) {
                        // Run the code here that needs
                        //    to access the data returned
                        tmp = data;
                        return data;
                    },
                    error: function (jqXHR, textStatus) {
                        console.log('DB error' + textStatus);
                        //alert('Error occured');
                    }
                });

                return tmp;
            }();

            console.log('DetailsIDs loaded successfully!')

            details = await function getDetails(detail_id) {
                let lang = undefined;
                if (document.getElementById('English').href == window.location.href + '#')
                    lang = 'en';
                if (document.getElementById('Italian').href == window.location.href + '#')
                    lang = 'it';
                var request_type = "getDetails";
                var tmp = null;
                $.ajax({
                    url: options.serverURL,
                    type: "POST",
                    async: false,
                    //contentType: 'application/json; charset=utf-8',
                    data: {
                        "action": request_type,
                        "lang": lang,
                        "version": version
                    },
                    dataType: "json",
                    //headers: {"Content-type" :"application/x-www-form-urlencoded"},
                    success: function (data) {
                        // Run the code here that needs
                        //    to access the data returned
                        tmp = data;
                        return data;
                    },
                    error: function (jqXHR, textStatus) {
                        console.log('DB error' + textStatus);
                        //alert('Error occured');
                    }
                });

                return tmp;
            }();

            console.log('Details loaded successfully!')

        } catch (error) {
            console.log(error)
            alert('La tua connessione Internet è troppo lenta!')
        }
    }
})(jQuery);

let modelURL = window.location.href.replace('/it', "");
modelURL = modelURL.replace('camera-view.html', "") + 'networkModels/art_details/art_details';


try {
    model = await tf.loadGraphModel(
        modelURL,
        {fromTFHub: true});

    console.log('Classifier loaded Succesfully!');
} catch (error) {
    console.log(error)
    alert('La tua connessione Internet è troppo lenta!')
}


//Funzioni utilizzate per il riconoscimento


const setSheetHeight = (value) => {
    sheetHeight = Math.max(0, Math.min(100, value))
    sheetContents.style.height = `${sheetHeight}vh`

    if (sheetHeight === 100) {
        sheetContents.classList.add("fullscreen")
    } else {
        sheetContents.classList.remove("fullscreen")
    }
}

const setIsSheetShown = (value) => {
    sheet.setAttribute("aria-hidden", String(!value))
}

function getClass(webcam) {
    return tf.tidy(function () {
        // Grab pixels from current VIDEO frame.
        let videoFrameAsTensor = tf.browser.fromPixels(webcam);
        // Resize video frame tensor to be 224 x 224 pixels which is needed by MobileNet for input.
        let resizedTensorFrame = tf.image.resizeBilinear(
            videoFrameAsTensor,
            [224, 224],
            true
        );
        let normalizedTensorFrame = resizedTensorFrame.div(255);
        normalizedTensorFrame = normalizedTensorFrame.reshape([1, 224, 224, 3]);
        let probabilities = model.predict(normalizedTensorFrame);
        probabilities = probabilities.arraySync();
        const max = Math.max(...probabilities[0]);
        console.log(max)
        if (max > (detailIDs[probabilities[0].indexOf(max)]['confidence'] - 0.2))
            return probabilities[0].indexOf(max);
        return null;
    });
}

function displayInfo(classID) {
    artworkTitle.innerText = details[detailIDs[classID]['id']]['artwork'];
    author.innerText = details[detailIDs[classID]['id']]['author'];
    detailName.innerText = details[detailIDs[classID]['id']]['detail-name'];
    detailImage.src = details[detailIDs[classID]['id']]['image'];
    description.innerText = details[detailIDs[classID]['id']]['description'];
    if (details[detailIDs[classID]['id']]['audio-guide'] != "") {
        document.getElementById('audio').style.display = 'block';
        document.getElementById('audio').src = details[detailIDs[classID]['id']]['audio-guide'];
        document.getElementById('audioGuide').style.display = 'none';
        document.getElementById('restart').style.display = 'none';
    } else {
        document.getElementById('audioGuide').style.display = 'inline';
        document.getElementById('audio').style.display = 'none';
    }

    if (details[detailIDs[classID]['id']]['video'] != "") {
        document.getElementById('detailVideo').src = details[detailIDs[classID]['id']]['video'];
        document.getElementById('detailVideo').style.display = 'block';
        document.getElementById('detailVideo').poster = details[detailIDs[classID]['id']]['image'];
    } else {
        document.getElementById('detailVideo').style.display = 'none';
    }
    setIsSheetShown(true)
}


function predictLoop() {
    console.log('Recognition Started!')
    let classID = getClass(webcam);

    if (classID) {
        displayInfo(classID);
    }


}

function startPredictLoop() {
    if (webcam.readyState >= 2) {
        console.log('Ready to predict');
        setTimeout(function () {
            camera_box.classList.add('loaded');
        }, 500);
        setInterval(function () {
            predictLoop()
        }, 2000);
    } else {
        setTimeout(function () {
            startPredictLoop()
        }, 1000)
    }
}


//Avvio Riconoscimento

const webcam = document.getElementById('camera--view');
const camera_box = document.getElementById('camera');
const detailContainer = document.getElementById('detailContainer')
let video = document.querySelector('#camera--view')
const sheetContents = sheet.querySelector(".contents");
const artworkTitle = document.getElementById('artworkTitle');
const author = document.getElementById('author');
const detailName = document.getElementById('detailName');
const detailImage = document.getElementById('detailImage');
const description = document.getElementById('description');
const detailLinks = document.getElementsByClassName('details');
const detailImg = document.getElementsByClassName('detailImg');
const detailLabels = document.getElementsByClassName('detailLabel');
const info = document.getElementById('over-details');


setSheetHeight(Math.min(16, 720 / window.innerHeight * 100));
startPredictLoop();