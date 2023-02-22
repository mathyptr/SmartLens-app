let version = 3;  // Object detection mode
//Caricamento dei dati da database e del modello
let detailIDs = undefined;
let details = undefined;
let objectDetector = undefined;


(function ($) {
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
                if (tmp == null)
                    alert('Can not connect to Smart Lens database!')
                return tmp;
            }();

            console.log('DetailsIDs loaded successfully!')

            details = await function getDetails() {
                let lang = 'en';
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
            console.log('details loaded successfully!')
        } catch (error) {
            console.log(error)
            alert('Internet connection is too slow!')
        }
    }
})(jQuery);

let modelURL = window.location.href
if (window.location.href.includes('/it'))
    modelURL = window.location.href.replace('/it', "");
else if (window.location.href.includes('/gr'))
    modelURL = window.location.href.replace('/gr', "");
else if (window.location.href.includes('/de'))
    modelURL = window.location.href.replace('/de', "");
// alternatively, if the system is not installed on a server with URLs like https:/foo.bar/smartlens use the following line:
// This code uses the split() method to split the URL into an array of substrings, using the forward slash / as the separator.
// It then uses the slice() method to extract the first three elements of the array, which correspond to the protocol, host, and port.
// Finally, it uses the join() method to combine these elements back into a string, which represents the base URL.
// let baseURL = window.location.href.split("/").slice(0, 3).join("/");
// XXX: layer #s change with each conversion to TensorflowJS. The bbox layer has a shape [1, 100, 4], the class layer has a shape [1 ... 100], and the probability layer has a shape [1 ... 100].
//modelURL = modelURL.replace('camera-view.html', "") + 'networkModels/art_details_obj/art_details';  // layers: 1: bboxes ; 2: classes ; 3: probabilities
modelURL = modelURL.replace('camera-view_json.html', "") + 'networkModels/art_details_obj/reinherit_test_final_30k_b64';  // layers: 3: bboxes ; 7: classes ; 2: probabilities

try {
    objectDetector = await tf.loadGraphModel(
        modelURL,
        {fromTFHub: true});

    console.log('Object Detector loaded successfully!');
} catch (error) {
    console.log(error)
    alert('Internet connection is too slow!')
}


function drawBoxes(bounding_box, color) {
    let box = document.createElement('p');
    camera_box.appendChild(box)
    let x, y, width, height = undefined;
    if (document.documentElement.clientWidth / document.documentElement.clientHeight > webcam.videoWidth / webcam.videoHeight) {
        let offsetY = (document.documentElement.clientWidth * webcam.videoHeight / webcam.videoWidth - document.documentElement.clientHeight) / 2
        x = bounding_box[1] * document.documentElement.clientWidth;
        y = bounding_box[0] * webcam.videoHeight * document.documentElement.clientWidth / webcam.videoWidth - offsetY;
        width = bounding_box[3] * document.documentElement.clientWidth - x;
        height = bounding_box[2] * webcam.videoHeight * document.documentElement.clientWidth / webcam.videoWidth - offsetY - y;
    } else {
        let offsetX = (document.documentElement.clientHeight * webcam.videoWidth / webcam.videoHeight - document.documentElement.clientWidth) / 2;
        x = bounding_box[1] * webcam.videoWidth * document.documentElement.clientHeight / webcam.videoHeight - offsetX;
        y = bounding_box[0] * document.documentElement.clientHeight;
        width = bounding_box[3] * webcam.videoWidth * document.documentElement.clientHeight / webcam.videoHeight - offsetX - x;
        height = bounding_box[2] * document.documentElement.clientHeight - y;
    }

    box.style.position = 'fixed'
    box.style.zIndex = '2'
    box.style.left = String(x) + 'px';
    box.style.top = String(y) + 'px';
    box.style.width = String(width) + 'px';
    box.style.height = String(height) + 'px';
    box.style.border = '4px solid ' + color;
    box.style.margin = '0';
    box.classList.add('bounding-box');
}


async function detectObjects(webcam) {
    let videoFrameAsTensor = tf.browser.fromPixels(webcam);
    let normalizedTensorFrame = videoFrameAsTensor.reshape([1, webcam.videoHeight, webcam.videoWidth, 3])

    const predictions = await objectDetector.executeAsync(normalizedTensorFrame);

    // Dispose of the intermediate tensors
    videoFrameAsTensor.dispose();
    normalizedTensorFrame.dispose();

    return predictions; // FIXME: there are still 8 tensors leaking on the GPU memory
}


function getObjects(predictions) {
    let boundingBoxes = predictions[3].arraySync();
    let classes = predictions[7].arraySync();
    let probabilities = predictions[2].arraySync();
    let recognisedDetails = []
    let recognisedBoxes = []
    for (let i = 0; i < classes[0].length; i++) {
        if (probabilities[0][i] > detailIDs[classes[0][i]]['confidence'] && !recognisedDetails.includes(classes[0][i])) {
            recognisedDetails.push(classes[0][i])
            recognisedBoxes.push(boundingBoxes[0][i])
        }
    }
    return [recognisedDetails, recognisedBoxes]
}


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


function displayInfo(results, boundingBoxes) {

    let main_artwork = details[detailIDs[results[0]]['id']]['artwork-id'];
    for (let i = 0; i < detailLinks.length; i++) {
        detailLinks[i].style.display = 'none';
    }

    detailContainer.style.display = 'none';
    artworkTitle.innerText = details[main_artwork]['artwork'];
    author.innerText = details[main_artwork]['author'];
    detailName.innerText = details[main_artwork]['detail-name'];
    detailImage.src = details[main_artwork]['image'];
    description.innerText = details[main_artwork]['description'];
    if (details[main_artwork]['audio-guide'] != "" && details[main_artwork]['audio-guide'] != null) {
        document.getElementById('audio').style.display = 'block';
        document.getElementById('audio').src = details[main_artwork]['audio-guide'];
        document.getElementById('audioGuide').style.display = 'none';
        document.getElementById('restart').style.display = 'none';
    } else {
        document.getElementById('audioGuide').style.display = 'inline';
        document.getElementById('audio').style.display = 'none';
    }

    if (details[main_artwork]['video'] != "" && details[main_artwork]['video'] != null) {
        document.getElementById('detailVideo').src = details[main_artwork]['video'];
        document.getElementById('detailVideo').style.display = 'block';
        document.getElementById('detailVideo').poster = details[main_artwork]['image'];
    } else {
        document.getElementById('detailVideo').style.display = 'none';
    }
    setIsSheetShown(true)
    let detailNames = [];
    let colors = ['#2E92A9', '#F4F4F4', '#EF7365', '#FBD26C']
    let max_display_results = Math.min(results.length, 4)
    for (let i = 0; i < max_display_results; i++) {
        let details_id = detailIDs[results[i]]['id'];
        if (!detailNames.includes(details[details_id]['detail-name'])) {
            detailNames.push(details[detailIDs[results[i]]['id']]['detail-name']);
            detailLinks[i].style.display = 'block';
            detailContainer.style.display = 'flex';
            detailImg[i].src = details[detailIDs[results[i]]['id']]['detail-icon'];
            detailImg[i].style.borderColor = colors[parseInt(results[i]) % colors.length];
            detailLabels[i].innerText = details[detailIDs[results[i]]['id']]['detail-name'];
            // detailLinks[i].href = 'detailView.php?id=' + detailIDs[results[i]]['id'];
            detailLinks[i].setAttribute('data-id', detailIDs[results[i]]['id']);
            detailLinks[i].addEventListener('click', function () {
                let id = this.getAttribute('data-id');
                let lang = 'en';
                if (document.getElementById('English').href == window.location.href + '#')
                    lang = 'en';
                if (document.getElementById('Italian').href == window.location.href + '#')
                    lang = 'it';
                getDetailsInfoJSON(id, lang);
                return false;
            });
            drawBoxes(boundingBoxes[i], colors[parseInt(results[i]) % colors.length])
        } else {
            detailLinks[i].style.display = 'none';
        }
    }
}


function getDetailsInfoJSON(detail_id, lang) {
    fetch('detailView_json.php?id=' + detail_id + '&lang=' + lang)
        .then((response) => response.json())
        .then((data) => {
                const name = data[0]['detail-name'];
                const artwork = data[0]['artwork'];
                const author = data[0]['author'];
                const description = data[0]['description'];
                const image = data[0]['image'];
                const audio_guide = data[0]['audio-guide'];
                const video = data[0]['video'];

                detail_detailName.innerText = name;
                detail_artworkTitle.innerText = artwork;
                detail_author.innerText = author;
                detail_description.innerText = description;
                detail_detailImage.src = image;
                if (audio_guide != "" && audio_guide != null) {
                    document.getElementById('detail_audio').style.display = 'block';
                    document.getElementById('detail_audio').src = audio_guide;
                    document.getElementById('detail_audioGuide').style.display = 'none';
                    document.getElementById('detail_restart').style.display = 'none';
                } else {
                    document.getElementById('detail_audioGuide').style.display = 'inline';
                    document.getElementById('detail_audio').style.display = 'none';
                }
                if (video != "" && video != null) {
                    document.getElementById('detail_detailVideo').src = video;
                    document.getElementById('detail_detailVideo').style.display = 'block';
                    document.getElementById('detail_detailVideo').poster = image;
                } else {
                    document.getElementById('detail_detailVideo').style.display = 'none';
                }
                document.getElementById('detail_view_json').style.display = 'block';
            }
        );
}

function hideInfoSheet() {
    for (let i = 0; i < detailLinks.length; i++) {
        detailLinks[i].style.display = 'none';
    }
    detailContainer.style.display = 'none';
    setIsSheetShown(false)
}


const infoDisplayLatency = 5;
let displayCounter = 0;
async function predictLoop() {

    console.log('Recognition Started!')
    let bounding_boxes = document.getElementsByClassName('bounding-box')
    for (let i = bounding_boxes.length - 1; i >= 0; i--) {
        bounding_boxes[i].remove();
    }
    let imageObjects = await detectObjects(webcam);
    let predictions = getObjects(imageObjects);
    let results = predictions[0];
    let boundingBoxes = predictions[1];
    if (results.length !== 0) {
        displayInfo(results, boundingBoxes);
        displayCounter = 0;
    } else {
        displayCounter ++;
        if (displayCounter > infoDisplayLatency) {
             hideInfoSheet();
        }
    }
}


function startPredictLoop() {
    if (webcam.readyState >= 2 && objectDetector != undefined) {
        console.log('Ready to predict');
        setTimeout(function () {
            camera_box.classList.add('loaded');
        }, 2000);
        setInterval(function () {
            predictLoop()
        }, 2000)
    } else {
        setTimeout(function () {
            startPredictLoop()
        }, 1000)
    }
}


const webcam = document.getElementById('camera--view');
const camera_box = document.getElementById('camera');
const detailContainer = document.getElementById('detailContainer');
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

const detail_artworkTitle = document.getElementById('detail_artworkTitle');
const detail_author = document.getElementById('detail_author');
const detail_detailName = document.getElementById('detail_detailName');
const detail_detailImage = document.getElementById('detail_detailImage');
const detail_description = document.getElementById('detail_description');
const detail_audio = document.getElementById('detail_audio');
const detail_video = document.getElementById('detail_detailVideo');
const detail_view_close_button = document.getElementById('detail_close-sheet');
detail_view_close_button.addEventListener('click', function () {
    document.getElementById('detail_view_json').style.display = 'none';
    return false;
});


setSheetHeight(Math.min(16, 720 / window.innerHeight * 100));
startPredictLoop();
