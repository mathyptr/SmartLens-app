let version = 3;  // Object detection mode
//Caricamento dei dati da database e del modello
//let detailIDs = undefined;
//let details = undefined;
let objectDetector = undefined;
let tensor_label=[];

let bb_id=0;
let classes_id=0;
let prob_id=0;
let numdet_id=0;
let probXview=0;


const classes_label= "Identity_2:0";
const boundingBox_label= "Identity_1:0";
const probabilities_label= "Identity_4:0";
const num_detections_label="num_detections";




// Set constraints for the video stream
//MATHY const constraints = {video: {facingMode: "environment"}, audio: false, zoom: true};
//const constraints = {video: {facingMode: "environment"}, audio: false};
const constraints = {video: {facingMode: "environment"}, audio: false};
// Define constants
const cameraView = document.querySelector("#camera--view")
const webcam = document.getElementById('camera--view');


let modelURL = window.location.href
if (window.location.href.includes('/it'))
    modelURL = window.location.href.replace('/it', "");
else if (window.location.href.includes('/gr'))
    modelURL = window.location.href.replace('/gr', "");
else if (window.location.href.includes('/de'))
    modelURL = window.location.href.replace('/de', "");
//modelURL = modelURL.replace('camera-view_json.html', "") + 'networkModels/art_details_obj/reinherit_test_final_30k_b128';  // layers: 6: bboxes ; 7: classes ; 0: probabilities
modelURL = modelURL.replace('mycamera-view_json.html', "") + 'networkModels/art_details_obj/botticelliwebmodel/model.json';  // layers: 1: bboxes ; 0: classes ; 4: probabilities
//modelURL ='http://localhost:4444/model.json';

/*
try {
//MATHY    console.log('TFJS version: ' + tf.version.tfjs)
    console.log('Loading Object Detector...');
//MATHY    objectDetector = await tf.loadGraphModel(modelURL,{fromTFHub: true});
    objectDetector = await tf.loadGraphModel(modelURL,{fromTFHub: false});


    console.log('Object Detector loaded successfully!');
} catch (error) {
    console.log(error)
    alert('Internet connection is too slow!')
}
*/

async function load_model() {
    // It's possible to load the model locally or from a repo
    // You can choose whatever IP and PORT you want in the "http://127.0.0.1:8080/model.json" just set it before in your https server
    //const model = await loadGraphModel("http://127.0.0.1:8080/model.json");
//    const model = await tf.loadGraphModel(modelURL,{fromTFHub: false});
    const model = await tf.loadGraphModel(modelURL);
    //tensor_label= model.outputNodes;
    tensor_label= model.signature.outputs;
    console.log('TFJS version: ' + tf.version.tfjs);
    console.log("model.outputNodes: "+model.outputNodes);
    console.log("model.signature: "+model.signature);
    console.log("model.signature outputs: "+model.signature.outputs);
    console.log("model.signature outputs: "+Object.entries(model.signature.outputs));
    return model;
  }

// Access the device camera and stream to cameraView
function cameraStart() {
    const webCamPromise = navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
            window.stream = stream;
            cameraView.srcObject = stream;            
/*            track = stream.getTracks()[0];
            cameraView.srcObject = stream;

            const capabilities = track.getCapabilities();
            const settings = track.getSettings();

            const input = document.querySelector("#zoom");

            // Check whether zoom is supported or not.
            if (!('zoom' in settings)) {
                input.style.display = "None";
                return;
            }

            // Map zoom to a slider element.
            input.min = capabilities.zoom.min;
            input.max = capabilities.zoom.max;
            input.step = capabilities.zoom.step;
            input.value = settings.zoom;

            input.oninput = function (event) {
                track.applyConstraints({advanced: [{zoom: event.target.value}]});
            }
            input.hidden = false;
*/


            return new Promise((resolve, reject) => {
                webcam.onloadedmetadata = () => {
                  resolve();
                };
              });


        })
        .catch(function (error) {
            console.error("Oops. Something is broken.", error);
        });


        objectDetector = load_model();

        Promise.all([objectDetector, webCamPromise])
            .then(values => {
              detectFrame(webcam, values[0]);
            })
            .catch(error => {
              console.error(error);
        });
          

}

function detectFrame (video, model)  {
    tf.engine().startScope();
    model.executeAsync(process_input(video)).then(predictions => {
    renderPredictions(predictions, video);
    requestAnimationFrame(() => {
      detectFrame(video, model);
    });
    tf.engine().endScope();
  });
};

function process_input(video_frame){
const tfimg = tf.browser.fromPixels(video_frame).toInt();
const expandedimg = tfimg.transpose([0,1,2]).expandDims();
return expandedimg;
};


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
//    console.log('Number of tensors after disposal of temp tensors: ' + num_tensors_det);

    return predictions; // FIXME: there are still 8 tensors leaking on the GPU memory
}


function getObjects(predictions) {

    bb_id=1;
    classes_id=0;
    prob_id=4;
    numdet_id = 5;

    let boundingBoxes = undefined;
    let classes = undefined;
    let probabilities = undefined;
    let numdet = undefined;
    let prd = [];
/*
    for(let i = 0; i < tensor_label.length; i++) {
        if(tensor_label[i]['name']==classes_label)
            classes_id = i;
        else if(tensor_label[i]['name']==boundingBox_label)
            bb_id = i;
        else if(tensor_label[i]['name']==probabilities_label)
            prob_id = i;
        else if(tensor_label[i]['name']==num_detections_label)
            numdet_id = i;
    }
*/
    let i=0;
    for (const [key, value] of Object.entries(tensor_label)) {
        if(value['name']==classes_label)
            classes_id = i;
        else if(value['name']==boundingBox_label)
            bb_id = i;
        else if(value['name']==probabilities_label)
            prob_id = i;
        else if(value['name']==num_detections_label)
            numdet_id = i;
        i++;
    }

    boundingBoxes = predictions[bb_id].arraySync();
    classes = predictions[classes_id].arraySync();
    probabilities = predictions[prob_id].arraySync();
    numdet = predictions[numdet_id].arraySync();
/*
    for(let i = 0; i < predictions.length; i++) {
        prd[i] = predictions[i].arraySync();
        if(prd[i][0][0] != undefined) {
   if (!Number.isInteger(prd[i][0][0]) && prd[i][0].length == 100 && prd[i][0][0].length != 26 && prd[i][0][0].length != 4) {
      prob_id = i;
               probabilities = prd[i];//.arraySync();
            }else if(!Number.isInteger(prd[i][0][0]) && prd[i][0].length == 100 && prd[i][0][0].length != 26 && prd[i][0][0].length == 4){
                bb_id = i;
                boundingBoxes = prd[i];//.arraySync();
            }else if(Number.isInteger(prd[i][0][0]) && prd[i][0].length == 100 && prd[i][0][0]<1000){
                classes_id = i;
                classes = prd[i];//.arraySync();
            }
        }
    }
*/
//    console.log('Classe Id: ' + classes_id +' BoundingBoxes Id: ' + bb_id + ' Probabilities Id: ' + prob_id);

    let recognisedDetails = []
    let recognisedBoxes = []

    for (let i = 0; i < classes[0].length; i++) {
        probXview=probabilities[0][i] ;
// if(classes[0][i]<25)
        {
            let detail_confidence=detailIDs[classes[0][i]]['confidence'] ;
// let detail_confidence=0.75 ;
            if (probabilities[0][i] > detail_confidence && !recognisedDetails.includes(classes[0][i])) {
                recognisedDetails.push(classes[0][i])
                recognisedBoxes.push(boundingBoxes[0][i])
            }
        }
    }

/*   let threshold=0.4
   probabilities[0].forEach((probabilities, i) => {
if(classes[0][i]==1 || classes[0][i]==2)
probXview=probabilities ;
      if (probabilities > threshold) {
recognisedDetails.push(classes[0][i])
recognisedBoxes.push(boundingBoxes[0][i])
      }
    })

*/

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
                const name =data[0]['title']; // data[0]['detail-name'];
                const artwork = data[0]['titlArtwork'];
                const author = data[0]['author'];
                const description = data[0]['description'];
                const image = data[0]['imgsrc']; //data[0]['image'];
                const audio_guide = null;//data[0]['audio-guide'];
                const video =null; //data[0]['video'];

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
//async function predictLoop() {
function renderPredictions(predictions, video) {
//    console.log('Recognition Started!')
 
//if (webcam.readyState >= 2 && objectDetector != undefined) {
    let element=document.getElementById("loader-wrapper");
    if(element!=null)
        element.remove();
//}


   let bounding_boxes = document.getElementsByClassName('bounding-box')
    for (let i = bounding_boxes.length - 1; i >= 0; i--) {
        bounding_boxes[i].remove();
    }
//    let imageObjects = await detectObjects(webcam);
    let predict = getObjects(predictions);
    document.getElementById('prob_view').innerText=probXview;
    let results = predict[0];
    let boundingBoxes = predict[1];
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


//const webcam = document.getElementById('camera--view');
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
//startPredictLoop();
// Take a picture when cameraTrigger is tapped

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);
