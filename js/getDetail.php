<?php
ini_set('display_errors', 1);
$conn = new mysqli('localhost', 'tesi', 'tesi', 'tesi');
if(!$conn){
    echo 'Connection error: '. mysqli_connect_error();
}

$sql = 'SELECT feature FROM features';

$result = mysqli_query($conn, $sql);



$row = mysqli_fetch_array($result);
$features = json_decode($row['feature'], true);

$sql2 = 'SELECT * FROM details where id = 0';
$image = mysqli_query($conn, $sql2);
$det = mysqli_fetch_array($image);

?>

<script type="module">
    const model = await tf.loadGraphModel(
        'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1',
        { fromTFHub: true });

    // Preprocesses a single image tensor to prepare it as input for the model.
    //
    // Returns a tensor of shape [batch_size, height, width, channels], where the
    // batch_size in this case is 1.
    function preprocess(imageTensor) {
        const widthToHeight = imageTensor.shape[1] / imageTensor.shape[0];
        let squareCrop;
        if (widthToHeight > 1) {
            const heightToWidth = imageTensor.shape[0] / imageTensor.shape[1];
            const cropTop = (1-heightToWidth) / 2;
            const cropBottom = 1 - cropTop;
            squareCrop = [[cropTop, 0, cropBottom, 1]];
        } else {
            const cropLeft = (1-widthToHeight) / 2;
            const cropRight = 1 - cropLeft;
            squareCrop = [[0, cropLeft, 1, cropRight]];
        }
        // Expand image input dimensions to add a batch dimension of size 1.
        const crop = tf.image.cropAndResize(
            tf.expandDims(imageTensor), squareCrop, [0], [224, 224]);
        return crop.div(255);
    }
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


    const body = document.getElementById('camera')
    let video = document.querySelector('#camera--view')

    function cutImageUp() {
        let imagePieces = [];
        for (let x = 0; x < 2; ++x) {
            for (let y = 0; y < 2; ++y) {
                let canvas = document.getElementById('canvas_no_display');
                canvas.width = webcam.videoWidth/2;
                canvas.height = webcam.videoHeight/2;
                console.log(webcam.videoWidth);
                let context = canvas.getContext('2d');
                context.drawImage(webcam, x * webcam.videoWidth / 2, y * webcam.videoHeight / 2, webcam.videoWidth / 2, webcam.videoHeight / 2, 0, 0, canvas.width, canvas.height);
                imagePieces.push(context.getImageData(0,0, canvas.width, canvas.height));
            }
        }
        return imagePieces
    }


    const artwork = document.createElement('a');
    body.appendChild(artwork);
    artwork.href = "detailView.php"
    const detail0_0 = document.createElement('a');
    body.appendChild(detail0_0);
    detail0_0.href = "detailView.php"
    const detail0_1 = document.createElement('a');
    body.appendChild(detail0_1);
    detail0_1.href = "detailView.php"
    const detail1_0 = document.createElement('a');
    body.appendChild(detail1_0);
    detail1_0.href = "detailView.php"
    const detail1_1 = document.createElement('a');
    body.appendChild(detail1_1);
    detail1_1.href = "detailView.php"
    function predictLoop() {
        tf.tidy(function() {
            let features = <?php echo $row['feature']?>;
            let imageFeatures = calculateFeaturesOnCurrentFrame(webcam);
            let fullImg = closestDetail(features, imageFeatures);
            let form = document.getElementsByTagName('form');
            const input = document.getElementById('detectedImg')
            input.value = fullImg;
            form.submit()
            <?php
            if ( isset( $_GET['form'] ) )
                $id = $_GET['data'];
            $sql2 = "SELECT * FROM details where id = '".$id."'";
            $image = mysqli_query($conn, $sql2);
            $det = mysqli_fetch_array($image);
            mysqli_close($conn);
            ?>

            console.log(fullImg);
            let imageParts = cutImageUp();
            let webcamFeatures = undefined;
            let details = [];
            for (let i=0; i<4; i++){
                webcamFeatures = calculateFeaturesOnCurrentFrame(imageParts[i]);
                details.push(closestDetail(features, webcamFeatures));
            }

            if(fullImg){
                artwork.style.backgroundImage = 'url('+ '<?php echo htmlspecialchars($det[4]) ?>' + ')';
                artwork.style.position = "fixed";
                artwork.style.left = 'calc(50% - 75px)';
                artwork.style.top = 'calc(50% - 75px)';
                artwork.style.width = '150px';
                artwork.style.height = '150px';
                artwork.style.display = 'block';
                artwork.style.borderRadius = '50%';
                artwork.style.border = '4px solid #2091EB';
                artwork.style.zIndex = '999';
            }else{
                artwork.style.display = 'none';
            }

            if(details[0]){
                detail0_0.style.backgroundImage = 'url('+ '<?php echo htmlspecialchars($det[4]) ?>' + ')';
                detail0_0.style.position = "fixed";
                detail0_0.style.left = 'calc(25% - 75px)';
                detail0_0.style.top = 'calc(25% - 75px)';
                detail0_0.style.width = '150px';
                detail0_0.style.height = '150px';
                detail0_0.style.display = 'block';
                detail0_0.style.borderRadius = '50%';
                detail0_0.style.border = '4px solid #2091EB';
                detail0_0.style.zIndex = '999';
            }else {
                detail0_0.style.display = 'none';
            }

            if(details[1]){
                detail0_1.style.backgroundImage = 'url('+ '<?php echo htmlspecialchars($det[4]) ?>' + ')';
                detail0_1.style.position = "fixed";
                detail0_1.style.left = 'calc(75% - 75px)';
                detail0_1.style.top = 'calc(25% - 75px)';
                detail0_1.style.width = '150px';
                detail0_1.style.height = '150px';
                detail0_1.style.display = 'block';
                detail0_1.style.borderRadius = '50%';
                detail0_1.style.border = '4px solid #2091EB';
                detail0_1.style.zIndex = '999';
            }else {
                detail0_1.style.display = 'none';
            }

            if(details[2]){
                detail1_0.style.backgroundImage = 'url('+ '<?php echo htmlspecialchars($det[4]) ?>' + ')';
                detail1_0.style.position = "fixed";
                detail1_0.style.left = 'calc(25% - 75px)';
                detail1_0.style.top = 'calc(75% - 75px)';
                detail1_0.style.width = '150px';
                detail1_0.style.height = '150px';
                detail1_0.style.display = 'block';
                detail1_0.style.borderRadius = '50%';
                detail1_0.style.border = '4px solid #2091EB';
                detail1_0.style.zIndex = '999';
            }else {
                detail1_0.style.display = 'none';
            }

            if(details[3]){
                detail1_1.style.backgroundImage = 'url('+ '<?php echo htmlspecialchars($det[4]) ?>' + ')';
                detail1_1.style.position = "fixed";
                detail1_1.style.left = 'calc(75% - 75px)';
                detail1_1.style.top = 'calc(75% - 75px)';
                detail1_1.style.width = '150px';
                detail1_1.style.height = '150px';
                detail1_1.style.display = 'block';
                detail1_1.style.borderRadius = '50%';
                detail1_1.style.border = '4px solid #2091EB';
                detail1_1.style.zIndex = '999';
            }else {
                detail1_1.style.display = 'none';
            }


        });

        window.requestAnimationFrame(predictLoop);

    }

    webcam.addEventListener("loadeddata", predictLoop);





</script>
