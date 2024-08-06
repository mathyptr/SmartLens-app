<?php
require_once("./server/config.php");
ini_set('display_errors', 1);


if(isset($_POST['submit'])){
    if(@getimagesize($_FILES['image']['tmp_name']) == FALSE){
        echo "<span class='image_select'>please select an image</span>";

    }
    else{
        $parent_dir = dirname(__DIR__);
        $uploaddir = $parent_dir."/SmartLens-app/images/"; 
        $image = addslashes($_FILES['image']['tmp_name']);
        $name  = addslashes($_FILES['image']['name']);
        $image = file_get_contents($image);
        $image = base64_encode($image);
        saveimage($name,$image);
        $uploadfile = $uploaddir . basename($_FILES['image']['name']);
        move_uploaded_file($_FILES['image']['tmp_name'], $uploadfile);
    }

}

function saveimage($name,$image)
{
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    if (!$conn) {
        echo 'Connection error: ' . mysqli_connect_error();
    }

    if (!$conn->set_charset("utf8")) {
        error_log("Error loading character set utf8: %s\n", $conn->error);
    }

    $sql= "UPDATE artworks SET imgsrc='./images/Venere_botticelli.jpg' where id=1";//SET imgsrc='$image' where id=xx"; prova


    if ($conn->query($sql) === TRUE) {
        echo '<script language=javascript>document.location.href="areaRiservata.html"</script>'; //echo "Record updated successfully";
    ;
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

}
