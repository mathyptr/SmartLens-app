// Set constraints for the video stream
//MATHY const constraints = {video: {facingMode: "environment"}, audio: false, zoom: true};
const constraints = {video: {facingMode: {exact: "environment"}}, audio: false};
// Define constants
const cameraView = document.querySelector("#camera--view")



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
modelURL = modelURL.replace('camera-view_json.html', "") + 'networkModels/art_details_obj/botticelliwebmodel/model.json';  // layers: 1: bboxes ; 0: classes ; 4: probabilities

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


async function load_model() {
    // It's possible to load the model locally or from a repo
    // You can choose whatever IP and PORT you want in the "http://127.0.0.1:8080/model.json" just set it before in your https server
    //const model = await loadGraphModel("http://127.0.0.1:8080/model.json");
    const model = await tf.loadGraphModel("https://raw.githubusercontent.com/hugozanini/TFJS-object-detection/master/models/kangaroo-detector/model.json");
    return model;
  }



// Access the device camera and stream to cameraView
function cameraStart() {
    const webCamPromise = navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
            track = stream.getTracks()[0];
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



            return new Promise((resolve, reject) => {
                this.videoRef.current.onloadedmetadata = () => {
                  resolve();
                };
              });


        })
        .catch(function (error) {
            console.error("Oops. Something is broken.", error);
        });
        
        let camera_box = document.getElementById('camera');
        camera_box.classList.add('loaded');

        objectDetector = load_model();

        Promise.all([objectDetector, webCamPromise])
            .then(values => {
              detectFrame(this.videoRef.current, values[0]);
            })
            .catch(error => {
              console.error(error);
        });
          

}

detectFrame = (video, model) => {
    tf.engine().startScope();
    model.executeAsync(process_input(video)).then(predictions => {
    this.renderPredictions(predictions, video);
    requestAnimationFrame(() => {
      this.detectFrame(video, model);
    });
    tf.engine().endScope();
  });
};

function process_input(video_frame){
const tfimg = tf.browser.fromPixels(video_frame).toInt();
const expandedimg = tfimg.transpose([0,1,2]).expandDims();
return expandedimg;
};


// Take a picture when cameraTrigger is tapped

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);
