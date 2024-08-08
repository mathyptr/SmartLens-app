<?php

  
/* set the answer format */
header('Content-Type: text/json');
require_once("config.php");

if(isset($_POST['action']))
    $action = $_POST['action'];

if(isset($_POST['version']))
    $version = $_POST['version'];

if(isset($_POST['data']))
    $data = $_POST['data'];

if(isset($_POST['type']))
    $type = $_POST['type'];

if(isset($_POST['id']))
    $id = $_POST['id'];

if(isset($_POST['table']))
    $table = $_POST['table'];

if(isset($_POST['col']))
    $col = $_POST['col'];

if(isset($_POST['language']))
    $language = $_POST['language'];

/* contains the DB query string */
$query_string = "";

/* handle different query types */
switch ($action) {
      /*case "getFeatures" :
        getFeatures($version);
        break;*/

    case "getDetails" :
        getDetails($version, $language);
        break;

    case "getDetailIDs":
        getDetailIDs($version);
        break;

    case "updateDetails": //mathy
        updateDetails($data,$id,$table, $col,$language);
       break;

    case "removeElement": //mathy
        removeElement($table,$id);
       break;

    /*case "getArtwork": //mathy
        getArtwork($id);
    break;*/
       
}


/*function getFeatures($version)
{
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    if (!$conn) {
        echo 'Connection error: ' . mysqli_connect_error();
    }

    if ($version == 1) {
        $sql = 'SELECT * FROM pythonfeatures';
    } else {
        $sql = 'SELECT * FROM features5descriptors';
    }

    $result = mysqli_query($conn, $sql);
    $features = array();

    // loop over results
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {

        $artwork = $row['artwork'];
        $detail_features = $row['features'];
        $distance = $row['distance'];

        $feature = array('artwork' => $artwork, 'features' => $detail_features, 'distance' => $distance);
        array_push($features, $feature);
    }

    echo json_encode($features);
    mysqli_close($conn);
}*/

function getDetails($version,$language)
{
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    if (!$conn) {
        error_log('Connection error: ' . mysqli_connect_error());
    }
    /* change character set to utf8 | Object Oriented*/
    if (!$conn->set_charset("utf8")) {
        error_log("Error loading character set utf8: %s\n", $conn->error);
    }

    /*if (isset($_POST['language'])) {
        $language = $_POST['language'];
    } else {
        echo "lang not set error";
        error_log("lang not set");
        return;
    }*/
    /*if ($version == 2) {
        if ($lang == 'it') {
            $sql = "SELECT * FROM details5descriptors_it";
        } else if ($lang == 'en') {
            $sql = "SELECT * FROM details5descriptors_en";
        }
    } else {
        if ($lang == 'it') {
            $sql = "SELECT * FROM details_it";
        } else if ($lang == 'en') {
            $sql = "SELECT * FROM details_en";
        }
    }*/

    /*$sql = "SELECT id, title as detailName, confidence, imgsrc, description,
    artworkTitle,author,artworkId, imgArt,descArt FROM details join 
    (select imgsrc as imgArt, description as descArt, artworks.id as artworkId, 
    artworks.title as artworkTitle, author from artworks) art on art.artworkId=artwork";*/


$sql = " select * from (select artwork, details.id,details.title as detailName, details.confidence, details.imgsrc, 
l1.data as description from details join language_mapping lm1 on details.id=lm1.external_id join 
language l1 on lm1.data=l1.id where type='detail' and l1.language='".$language."') det join
(select artworks.id as artworkId, artworks.title as artworkTitle, author, imgsrc as imgArt,
l2.data as descArt from artworks join language_mapping lm2 on artworks.id=lm2.external_id
join language l2 on lm2.data=l2.id where type='artwork' and l2.language='".$language."') art
on art.artworkId=det.artwork";




    $result = mysqli_query($conn, $sql);
    error_log('SQL query: ' . $sql); // debugging
    $details = array();

    // loop over results
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        $id = $row['id'];
        $detail_name = $row['detailName'];
        $artwork = $row['artworkTitle'];
        $author = $row['author'];
        $image = $row['imgsrc'];
       // $detail_icon = $row['detail-icon'];
        $description = $row['description'];
       // $audio_guide = $row['audio-guide'];
       // $video = $row['video'];
        $artwork_id = $row['artworkId'];
        $detail_icon = $row['imgsrc'];
        $audio_guide = "";
        $video ="";
        $image_art = $row['imgArt'];
       // $detail_icon = $row['detail-icon'];
        $desc_art = $row['descArt'];

        $details[$id] = array('detail-name' => $detail_name, 'artwork' => $artwork, 'author' => $author, 'image' => $image,
            'detail-icon' => $detail_icon, 'description' => $description, 'audio-guide' => $audio_guide, 'video' => $video,
            'artwork-id' => $artwork_id,'image-art' => $image_art,'desc-art' => $desc_art);
        foreach ($details[$id] as $key => $value) {
            error_log($key . ":" . $value);
        }
    }
    error_log('details num rows: ' . count($details));
    error_log('JSON details: ' . json_encode($details, JSON_PARTIAL_OUTPUT_ON_ERROR));
    echo json_encode($details);
    mysqli_close($conn);
}


function getDetailIDs($version)
{
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    if (!$conn) {
        echo 'Connection error: ' . mysqli_connect_error();
    }

    /*if ($version == 3) {
        $sql = 'SELECT * FROM id_objdet_mapping';
    } else {
        $sql = 'SELECT * FROM id_class_mapping';
    }*/
    $sql = 'SELECT * FROM net_details';

    $result = mysqli_query($conn, $sql);
    $detailIDs = array();

    // loop over results
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {

        $id = $row['id'];
        $id_net = $row['id_net'];
        $confidence = $row['confidence'];
        $detailIDs[$id_net] = array('id' => $id, 'confidence' => $confidence);
    }

    echo json_encode($detailIDs);
    mysqli_close($conn);
}

function updateDetails($data, $id, $table, $col,$language) //mathy
{
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    if (!$conn) {
        echo 'Connection error: ' . mysqli_connect_error();
    }
    
    if ($table=='details')
        $type='detail';
    else 
        $type='artwork';

    if($col=='description')
        $sql = "update language, language_mapping,".$table."  set language.data='" . $data . "' where language_mapping.data=language.id and ".$table.".id=language_mapping.external_id and type='".$type."' and language.language='".$language."' and ".$table.".id='".$id."'";
    else
        $sql = "UPDATE ".$table." SET ".$col."='" . $data . "' where id='".$id."'";
    
    if($col=='confidence')
        $sql = "update net_details, details set net_details.confidence=" . $data .", details.confidence=" . $data ." where details.id=net_details.id_net and details.id='".$id."'";


    

    echo $sql;
    
    if ($conn->query($sql) === TRUE) {
        echo "Record updated successfully";
    ;
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
  
  $conn->close();
}


function removeElement($table, $id,) //mathy
{
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    if (!$conn) {
        echo 'Connection error: ' . mysqli_connect_error();
    }
    
    if ($table=='details')
        $type='detail';
    else 
        $type='artwork';

    $sql ="delete language_mapping, language,".$table." from language_mapping JOIN language on language.id=language_mapping.data JOIN ".$table." on ".$table.".id=language_mapping.external_id where ".$table.".id='".$id."' and language_mapping.type='".$type."'";
    
    echo $sql;
    if ($conn->query($sql) === TRUE) {
        echo "Record removed successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>