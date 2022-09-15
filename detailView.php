<?php
$id = $_GET['id'];

ini_set('display_errors', 1);
$conn = new mysqli('localhost', 'tesi', 'tesi', 'tesi');
if(!$conn){
    echo 'Connection error: '. mysqli_connect_error();
}
$id = $conn-> escape_string($id);
$sql = "SELECT * FROM details WHERE id='$id'";

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
    <img class="responsive-image" id="detailImage" src="
 <?php
    echo htmlspecialchars($detail[0]['image']);
    ?>
"   >
    <div>
        <button type="button" id="audioGuide">
            <img class="responsive-image" src="images/icons/Audio%20Icon.png">
            <p>Ascolta la guida</p>
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



<script src="js/textToSpeech.js"></script>
</body>
</html>