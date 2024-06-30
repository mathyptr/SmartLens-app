let version = 3;  // Object detection mode
//Caricamento dei dati da database e del modello
let detailIDs = undefined;
let details = undefined;
let objectDetector = undefined;

let bb_id=0;
let classes_id=0;
let prob_id=0;

let probXview=0;

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
                        var msg = '';
                        if (jqXHR.status === 0) {
                            msg = 'Not connect.\n Verify Network.';
                        } else if (jqXHR.status == 404) {
                            msg = 'Requested page not found. [404]';
                        } else if (jqXHR.status == 500) {
                            msg = 'Internal Server Error [500].';
                        } else if (textStatus === 'parsererror') {
                            msg = 'Requested JSON parse failed.';
                        } else if (textStatus === 'timeout') {
                            msg = 'Time out error.';
                        } else if (textStatus === 'abort') {
                            msg = 'Ajax request aborted.';
                        } else {
                            msg = 'Uncaught Error.\n' + jqXHR.responseText;
                        }
                        console.log('DB error: ' + msg);
                        alert('Database connection error: '+ msg);
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
                        var msg = '';
                        if (jqXHR.status === 0) {
                            msg = 'Not connect.\n Verify Network.';
                        } else if (jqXHR.status == 404) {
                            msg = 'Requested page not found. [404]';
                        } else if (jqXHR.status == 500) {
                            msg = 'Internal Server Error [500].';
                        } else if (textStatus === 'parsererror') {
                            msg = 'Requested JSON parse failed.';
                        } else if (textStatus === 'timeout') {
                            msg = 'Time out error.';
                        } else if (textStatus === 'abort') {
                            msg = 'Ajax request aborted.';
                        } else {
                            msg = 'Uncaught Error.\n' + jqXHR.responseText;
                        }
                        console.log('DB error: ' + msg);
                        alert('Database connection error: '+ msg);
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
//modelURL = modelURL.replace('camera-view_json.html', "") + 'networkModels/art_details_obj/reinherit_test_final_30k_b64';  // layers: 3: bboxes ; 7: classes ; 2: probabilities
//modelURL = modelURL.replace('camera-view_json.html', "") + 'networkModels/art_details_obj/reinherit_test_final_30k_b96';  // layers: 6: bboxes ; 3: classes ; 1: probabilities
//modelURL = modelURL.replace('camera-view_json.html', "") + 'networkModels/art_details_obj/reinherit_test_final_30k_b128';  // layers: 6: bboxes ; 7: classes ; 0: probabilities
modelURL = modelURL.replace('camera-view_json.html', "") + 'networkModels/art_details_obj/botticelliwebmodel';  // layers: 1: bboxes ; 0: classes ; 4: probabilities

try {
    console.log('TFJS version: ' + tf.version.tfjs)
    console.log('Loading Object Detector...');
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
//MATHY    const videoFrameAsTensor = tf.browser.fromPixels(webcam);
//MATHY    const normalizedTensorFrame = videoFrameAsTensor.reshape([1, webcam.videoHeight, webcam.videoWidth, 3])

    let num_tensors_det = tf.memory().numTensors;
    console.log('Number of tensors before detection: ' + num_tensors_det);

//    const predictions = await objectDetector.executeAsync(normalizedTensorFrame);
    const predictions = await objectDetector.executeAsync(process_input(webcam));
    
    // Dispose of the intermediate tensors
//MATHY    videoFrameAsTensor.dispose();
//MATHY    normalizedTensorFrame.dispose();


    num_tensors_det = tf.memory().numTensors;
    console.log('Number of tensors after disposal of temp tensors: ' + num_tensors_det);

    return predictions; // FIXME: there are still 8 tensors leaking on the GPU memory
}

function process_input(video_frame){
    const tfimg = tf.browser.fromPixels(video_frame).toInt();
    const expandedimg = tfimg.transpose([0,1,2]).expandDims();
    return expandedimg;
  };


function getObjects(predictions) {
    
    bb_id=1;
    classes_id=0;
    prob_id=4;

    let boundingBoxes = undefined;
    let classes = undefined;
    let probabilities = undefined;


/*    let boundingBoxes = predictions[bb_id].arraySync();
    let classes = predictions[classes_id].arraySync();
    let probabilities = predictions[prob_id].arraySync();
*/

    for(let i = 0; i < predictions.length; i++) {
        predictions[i] = predictions[i].arraySync();
        if(predictions[i][0][0] != undefined) {
	    if (!Number.isInteger(predictions[i][0][0]) && predictions[i][0].length == 100 && predictions[i][0][0].length != 26 && predictions[i][0][0].length != 4) {
	           prob_id = i;
               probabilities = predictions[i];//.arraySync();
            }else if(!Number.isInteger(predictions[i][0][0]) && predictions[i][0].length == 100 && predictions[i][0][0].length != 26 && predictions[i][0][0].length == 4){
                bb_id = i;
                boundingBoxes = predictions[i];//.arraySync();
            }else if(Number.isInteger(predictions[i][0][0]) && predictions[i][0].length == 100 && predictions[i][0][0]<1000){
                classes_id = i;
                classes = predictions[i];//.arraySync();
            }
        }
    }
    console.log('Classe Id: ' + classes_id +' BoundingBoxes Id: ' + bb_id + ' Probabilities Id: ' + prob_id);

    let recognisedDetails = []
    let recognisedBoxes = []
    for (let i = 0; i < classes[0].length; i++) {
	probXview=probabilities[0][i] ;
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
 
    document.getElementById('prob_view').innerText=probXview;

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
    document.getElementById('prob_view').innerText=probXview;
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
