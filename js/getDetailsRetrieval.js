let version = 1; //Cambia valore a 2 per ottenere la versione con 5 descrittori

//Caricamento dei dati da database e del modello
let features = undefined;
let details = undefined;
let model = undefined;

await (function($){
    console.log("jQuery" + $);
    $.fn.getDetailFromWebcam = async function (options) {
        try {
            var $this = $(this);
            features = await function loadFeatures() {
                var request_type = "getFeatures";
                var tmp = null;

                $.ajax({
                    url: options.serverURL,
                    type: "POST",
                    async: false,
                    //contentType: 'application/json; charset=utf-8',
                    data: {"action": request_type,
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
                    error: function () {
                        alert('Error occured');
                    }
                });

                return tmp;
            }();

            console.log('Features loaded successfully!')

            details = await function getDetails(detail_id) {
                let lang = undefined;
                if(document.getElementById('Italian').href == window.location.href + '#')
                    lang = 'ita';
                else
                    lang = 'en';
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




        } catch(error) {
            console.log(error)
            alert('La tua connessione Internet è troppo lenta!')
        }
    }
})(jQuery);

try {
    model = await tf.loadGraphModel(
        'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1',
        {fromTFHub: true});

    console.log('MobileNet loaded Succesfully!');
} catch(error) {
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

function calculateFeaturesOnCurrentFrame(webcam) {
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
        let logits = model.predict(normalizedTensorFrame.expandDims()).squeeze();
        return logits.arraySync();
    });
}

function eucDistance(a, b) {
    return a
            .map((x, i) => Math.abs(x - b[i]) ** 2) // square the difference
            .reduce((sum, now) => sum + now) // sum
        ** (1 / 2)
}

function closestDetail(features, webcamFeatures) {
    let distance = undefined;
    let minDistance = Number.MAX_SAFE_INTEGER;
    let detail = undefined;
    let ind = 0;

    for (let i = 0; i < features.length; i++) {
        distance = eucDistance(JSON.parse(features[i]['features']), webcamFeatures);
        if (distance < minDistance) {
            minDistance = distance;
            detail = features[i]['artwork'];
            ind = i;
        }
    }
    if (minDistance < features[ind]['distance']) {
        return detail
    }
    return null;
}

function cutImageUp() {
    let imagePieces = [];
    if (version == 1){
        for (let x = 0; x < 2; ++x) {
            for (let y = 0; y < 2; ++y) {
                let canvas = document.getElementById('canvas_no_display');
                canvas.width = webcam.videoWidth / 2;
                canvas.height = webcam.videoHeight / 2;
                let context = canvas.getContext('2d');
                context.drawImage(webcam, x * webcam.videoWidth / 2, y * webcam.videoHeight / 2, webcam.videoWidth / 2, webcam.videoHeight / 2, 0, 0, canvas.width, canvas.height);
                imagePieces.push(context.getImageData(0, 0, canvas.width, canvas.height));
            }
        }
    }else{
        let canvas = document.getElementById('canvas_no_display');
        canvas.width = webcam.videoWidth / 3 * 2;
        canvas.height = webcam.videoHeight / 3 * 2;
        let context = canvas.getContext('2d');
        context.drawImage(webcam, webcam.videoWidth / 6, webcam.videoHeight / 6, 2 * (webcam.videoWidth / 3), 2 * (webcam.videoHeight / 3), 0, 0, canvas.width, canvas.height);
        imagePieces.push(context.getImageData(0, 0, canvas.width, canvas.height));
        for (let x = 0; x < 2; ++x) {
            for (let y = 0; y < 2; ++y) {
                context.drawImage(webcam, x * webcam.videoWidth / 3, y * webcam.videoHeight / 3, webcam.videoWidth / 3 * 2, webcam.videoHeight / 3 * 2, 0, 0, canvas.width, canvas.height);
                imagePieces.push(context.getImageData(0, 0, canvas.width, canvas.height));
            }
        }
    }

    return imagePieces
}


function displayInfo(fullImg, detailIDs){

    for(let i=0; i<detailLinks.length; i++){
        detailLinks[i].style.display = 'none';
    }
    detailContainer.style.display = 'none';
    artworkTitle.innerText = details[fullImg]['artwork'];
    author.innerText = details[fullImg]['author'];
    detailName.innerText = details[fullImg]['detail-name'];
    detailImage.src = details[fullImg]['image'];
    description.innerText = details[fullImg]['description'];
    if(details[fullImg]['audio-guide'] != "") {
        document.getElementById('audio').style.display = 'block';
        document.getElementById('audio').src = details[fullImg]['audio-guide'];
        document.getElementById('audioGuide').style.display = 'none';
        document.getElementById('restart').style.display = 'none';
    }else{
        document.getElementById('audioGuide').style.display = 'inline';
        document.getElementById('audio').style.display = 'none';
    }

    if(details[fullImg]['video'] != ""){
        document.getElementById('detailVideo').src = details[fullImg]['video'];
        document.getElementById('detailVideo').style.display = 'block';
        document.getElementById('detailVideo').poster = details[fullImg]['image'];
    }else{
        document.getElementById('detailVideo').style.display = 'none';
    }
    setIsSheetShown(true)
    let detailNames = [];
    for(let i in detailIDs){
        if (!detailNames.includes(details[detailIDs[i]]['detail-name'])) {
            detailNames.push(details[detailIDs[i]]['detail-name']);
            info.style.display = 'block';
            detailLinks[i].style.display = 'block';
            detailContainer.style.display = 'flex';
            detailImg[i].src = details[detailIDs[i]]['detail-icon'];
            detailLabels[i].innerText = details[detailIDs[i]]['detail-name'];
            detailLinks[i].href = 'detailView.php?id=' + detailIDs[i];
        } else {
            detailLinks[i].style.display = 'none';
        }
    }
}

function predictLoop() {
    console.log('Recognition Started!')
    let imageFeatures = calculateFeaturesOnCurrentFrame(webcam);
    let fullImg = closestDetail(features, imageFeatures);
    let imageParts = cutImageUp();
    let webcamFeatures = undefined;
    let detailIDs = [];
    for (let i = 0; i < 4; i++) {
        webcamFeatures = calculateFeaturesOnCurrentFrame(imageParts[i]);
        let detail = closestDetail(features, webcamFeatures)
        if (detail && !detailIDs.includes(detail) && detail != fullImg && detail in details)
            detailIDs.push(detail);
    }

    if (fullImg && fullImg in details) {
        displayInfo(fullImg, detailIDs)


    }


}

function startPredictLoop() {
    if (webcam.readyState >= 2) {
        console.log('Ready to predict');
        setTimeout(function(){
            camera_box.classList.add('loaded');
        }, 500);
        setInterval(function (){predictLoop()}, 2000)
    } else {
        setTimeout(function (){startPredictLoop()}, 1000)
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

