<?php
$id = $_GET['id'];
require_once("../server/config.php");
ini_set('display_errors', 1);
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
if (!$conn) {
    echo 'Connection error: ' . mysqli_connect_error();
}
$id = $conn->escape_string($id);
$sql = "SELECT * FROM detailsen WHERE id='$id'";

$result = mysqli_query($conn, $sql);

$detail = mysqli_fetch_all($result, MYSQLI_ASSOC);

mysqli_close($conn)


?>
<!DOCTYPE html>
<html lang="it-IT">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Name of your awesome camera app -->
    <title>Smart Lens</title>
    <!-- Link to your main style sheet-->
    <link rel="stylesheet" href="css/detailViewStyle.css">


</head>
<body>
<div id="languageContainer">
    <a id="Italian" href="../detailView.php?id=<?php echo htmlspecialchars($detail[0]['id']) ?>">Italiano</a>
    <a id="English" href="#">English</a>
</div>
<a id="close-sheet" href="camera-view.html">&#10006;</a>
<h2 id="artwork">
    <span id="artworkTitle">
        <?php
        echo htmlspecialchars($detail[0]['artwork']);
        ?>
    </span>
    -
    <span id="author">
        <?php
        echo htmlspecialchars($detail[0]['author']);
        ?>
    </span>
</h2>
<h3 id="detailName">
    <?php
    echo htmlspecialchars($detail[0]['detail-name']);
    ?>
</h3>
<div class="flex-container">
    <div>
        <img class="responsive-image" id="detailImage" src="
 <?php
        echo htmlspecialchars($detail[0]['image']);
        ?>
" alt="<?php
        echo htmlspecialchars($detail[0]['detail-name']) . 'image';
        ?>">
    </div>

    <div id="information">
        <audio id="audio" controls src=""></audio>
        <button type="button" id="audioGuide">
            <img class="responsive-image" src="../images/icons/Audio%20Icon.png" alt="Icona audio-guida">
            <p>Listen to the audio guide</p>
        </button>
        <button type="button" id="restart">
            &#8635; Restart
        </button>
        <p id="description">
            <?php
            echo htmlspecialchars($detail[0]['description']);
            ?>

        </p>
    </div>
</div>

<video class="responsive-image" id="detailVideo" src="" controls>
</video>

<script>
    const audio = document.getElementById('audio');
    const audioSource = "<?php echo htmlspecialchars($detail[0]['audio-guide'])?>";

    if (audioSource !== "") {
        audio.style.display = 'block';
        audio.src = audioSource;
        document.getElementById('audioGuide').style.display = 'none';
        document.getElementById('restart').style.display = 'none';
    }

    const video = document.getElementById('detailVideo');
    const videoSource = "<?php echo htmlspecialchars($detail[0]['video'])?>";
    if (videoSource !== "") {
        video.style.display = 'block';
        video.src = videoSource;
        video.poster = "<?php echo htmlspecialchars($detail[0]['image'])?>";
    }
</script>

<script src="../js/textToSpeech.js"></script>
</body>
</html>