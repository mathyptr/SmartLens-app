(function($){
    console.log("jQuery" + $);
    $.fn.getDetailFromWebcam = async function (options){

        const model = await tf.loadGraphModel(
            'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1',
            { fromTFHub: true });

        var $this = $(this);

        const webcam = document.getElementById('camera--view');

        function calculateFeaturesOnCurrentFrame(webcam){
            return tf.tidy(function() {
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
                    .map((x, i) => Math.abs( x - b[i] ) ** 2) // square the difference
                    .reduce((sum, now) => sum + now) // sum
                ** (1/2)
        }

        function closestDetail(features, webcamFeatures){
            let distance = undefined;
            let minDistance = Number.MAX_SAFE_INTEGER;
            let detail = undefined;

            for (const [key, value] of Object.entries(features)) {
                distance = eucDistance(value, webcamFeatures);
                if (distance < minDistance){
                    minDistance = distance;
                    detail = key;
                }
            }
            return detail
        }


        const detailContainer = document.getElementById('detailContainer')
        let video = document.querySelector('#camera--view')

        function cutImageUp() {
            let imagePieces = [];
            for (let x = 0; x < 2; ++x) {
                for (let y = 0; y < 2; ++y) {
                    let canvas = document.getElementById('canvas_no_display');
                    canvas.width = webcam.videoWidth/2;
                    canvas.height = webcam.videoHeight/2;
                    let context = canvas.getContext('2d');
                    context.drawImage(webcam, x * webcam.videoWidth / 2, y * webcam.videoHeight / 2, webcam.videoWidth / 2, webcam.videoHeight / 2, 0, 0, canvas.width, canvas.height);
                    imagePieces.push(context.getImageData(0,0, canvas.width, canvas.height));
                }
            }
            return imagePieces
        }

        let features = function loadFeatures() {
            var request_type = "getFeatures";
            var tmp = null;

            $.ajax({
                url: options.serverURL,
                type: "POST",
                async: false,
                //contentType: 'application/json; charset=utf-8',
                data: {"action" : request_type},
                dataType: "json",
                //headers: {"Content-type" :"application/x-www-form-urlencoded"},
                success: function(data) {
                    // Run the code here that needs
                    //    to access the data returned
                    tmp= data;
                    return data;
                },
                error: function() {
                    alert('Error occured');
                }
            });

            return tmp;
        }();

        function getDetails(detail_id){
            var request_type = "getDetail";
            var tmp = null;
            $.ajax({
                url: options.serverURL,
                type: "POST",
                async: false,
                //contentType: 'application/json; charset=utf-8',
                data: {"action" : request_type,
                    "id" : detail_id},
                dataType: "json",
                //headers: {"Content-type" :"application/x-www-form-urlencoded"},
                success: function(data) {
                    // Run the code here that needs
                    //    to access the data returned
                    tmp = data;
                    return data;
                },
                error: function(jqXHR, textStatus) {
                    console.log('DB error' + textStatus);
                    //alert('Error occured');
                }
            });

            return tmp;
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


        const sheetContents = sheet.querySelector(".contents");
        setSheetHeight(Math.min(16, 720 / window.innerHeight * 100));
        const artworkTitle = document.getElementById('artworkTitle');
        const author = document.getElementById('author');
        const detailName = document.getElementById('detailName');
        const detailImage = document.getElementById('detailImage');
        const description = document.getElementById('description');
        const detail0_0 = document.getElementById('detail0_0');
        const detail0_0Img = document.getElementById('detail0_0img');
        const detail0_1 = document.getElementById('detail0_1');
        const detail0_1Img = document.getElementById('detail0_1img');
        const detail1_0 = document.getElementById('detail1_0');
        const detail1_0Img = document.getElementById('detail1_0img');
        const detail1_1 = document.getElementById('detail1_1');
        const detail1_1Img = document.getElementById('detail1_1img');

        function predictLoop() {
            tf.tidy(function() {

                let imageFeatures = calculateFeaturesOnCurrentFrame(webcam);
                let fullImg = closestDetail(features, imageFeatures);
                let imageParts = cutImageUp();
                let webcamFeatures = undefined;
                let details = [];
                for (let i=0; i<4; i++){
                    webcamFeatures = calculateFeaturesOnCurrentFrame(imageParts[i]);
                    details.push(closestDetail(features, webcamFeatures));
                }

                if(fullImg){
                    let detail = getDetails(fullImg);
                    if(detail){
                        detail0_0.style.display = 'none';
                        detail0_1.style.display = 'none';
                        detail1_0.style.display = 'none';
                        detail1_1.style.display = 'none';
                        artworkTitle.innerText = detail['artwork'];
                        author.innerText = detail['author'];
                        detailName.innerText = detail['detail-name'];
                        detailImage.src = detail['image'];
                        description.innerText = detail['description'];
                        setIsSheetShown(true)
                    }

                }else{

                }

                if(details[0]){
                    let detail = getDetails(details[0]);
                    if(detail) {
                        detail0_0.style.display = 'block';
                        detail0_0Img.src = detail['detail-icon']
                        detail0_0.href = 'detailView.php?id=' + detail['id'];
                    }else{
                        detail0_0.style.display = 'none';
                    }
                }else {
                    detail0_0.style.display = 'none';
                }

                if(details[1]){
                    let detail = getDetails(details[1]);
                    if(detail) {
                        detail0_1.style.display = 'block';
                        detail0_1Img.src = detail['detail-icon']
                        detail0_1.href = 'detailView.php?id=' + detail['id'];
                    }else{
                        detail0_1.style.display = 'none';
                    }
                }else {
                    detail0_1.style.display = 'none';
                }

                if(details[2]){
                    let detail = getDetails(details[2]);
                    if(detail) {
                        detail1_0.style.display = 'block';
                        detail1_0Img.src = detail['detail-icon']
                        detail1_0.href = 'detailView.php?id=' + detail['id'];
                    }else{
                        detail1_0.style.display = 'none';
                    }
                }else {
                    detail1_0.style.display = 'none';
                }

                if(details[3]){
                    let detail = getDetails(details[2]);
                    if(detail) {
                        detail1_1.style.display = 'block';
                        detail1_1Img.src = detail['detail-icon']
                        detail1_1.href = 'detailView.php?id=' + detail['id'];
                    }else{
                        detail1_1.style.display = 'none';
                    }
                }else {
                    detail1_1.style.display = 'none';
                }


            });
            window.requestAnimationFrame(predictLoop);

        }
        webcam.addEventListener("loadeddata", predictLoop);
    }
})(jQuery);


