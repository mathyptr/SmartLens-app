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


if(isset($_POST['clk']))
    $clk = $_POST['clk'];

if(isset($_POST['idArt']))
    $idArt = $_POST['idArt'];

if(isset($_POST['left']))
    $left = $_POST['left'];   

if(isset($_POST['top']))
    $top = $_POST['top'];

if(isset($_POST['width']))
    $width = $_POST['width'];

if(isset($_POST['height']))
    $height = $_POST['height'];   

/* contains the DB query string */
$query_string = "";

/* handle different query types */
switch ($action) {


    case "getDetails" :
        getDetails($version, $language);
        break;

    case "getDetailIDs":
        getDetailIDs($version);
        break;

    case "updateDetails": 
        updateDetails($data,$id,$table, $col,$language);
       break;

    case "removeElement": 
        removeElement($table,$id);
       break;

    case "saveBbox": 
        saveBbox ($clk, $idArt, $left, $top, $width, $height);
    break;

    case "startAugmentation":
        startAugmentation();
    break;
}



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
        $description = $row['description'];
        $artwork_id = $row['artworkId'];
        $detail_icon = $row['imgsrc'];
        $audio_guide = "";
        $video ="";
        $image_art = $row['imgArt'];
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

    $sql = 'SELECT * FROM net_details';

    $result = mysqli_query($conn, $sql);
    $detailIDs = array();

    // loop over results
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {

        $id = $row['id'];
        $id_det = $row['id_det'];
        $confidence = $row['confidence'];
        $detailIDs[$id_det] = array('id' => $id, 'confidence' => $confidence);
    }

    echo json_encode($detailIDs);
    mysqli_close($conn);
}

function updateDetails($data, $id, $table, $col,$language)
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

function saveBbox ($clk, $idArt, $left, $top, $width, $height){
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    if (!$conn) {
        echo 'Connection error: ' . mysqli_connect_error();
    }

    $sql ="SELECT details.id as idDet FROM details join artworks on details.artwork=artworks.id WHERE artworks.id='".$idArt."' LIMIT 1";

    $result = mysqli_query($conn, $sql);
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        $idDet =$row['idDet'];
        $idDet=$idDet+$clk;
    }

    $sql = "UPDATE details SET lft=".$left.", top=".$top.", width=".$width.", height=".$height."  where id='".$idDet."'";
    echo $sql;
    if ($conn->query($sql) === TRUE) {
        echo "Record removed successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}


function removeElement($table, $id,) 
{
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    if (!$conn) {
        echo 'Connection error: ' . mysqli_connect_error();
    }

    $srcImg="";
    $parent_dir =dirname(__DIR__);

    $sql ="SELECT imgsrc from ".$table." where id='".$id."'";
    $result = mysqli_query($conn, $sql);
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        $srcImg =$parent_dir . substr($row['imgsrc'], 1);
        unlink($srcImg);
    }


    if ($table=='artworks'){
        $type='artwork';

        $sql ="SELECT imgsrc from details where artwork='".$id."'";
        $result = mysqli_query($conn, $sql);
        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
            $srcImg =$parent_dir . substr($row['imgsrc'], 1);
            unlink($srcImg);
        } 

        $sql ="delete language_mapping, language from language_mapping JOIN language on language.id=language_mapping.data JOIN details on details.id=language_mapping.external_id where details.artwork='".$id."' and language_mapping.type='detail'";
        if ($conn->query($sql) === TRUE) {
            echo "Record removed successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }

    else{
        $sql ="SELECT imgsrc from details where id=$id";
        $result = mysqli_query($conn, $sql);
        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
            $srcImg =$parent_dir .substr( $row['imgsrc'],1);
            unlink($srcImg);
        } 
        $type='detail';
    }
       

    $sql ="delete language_mapping, language,".$table." from language_mapping JOIN language on language.id=language_mapping.data JOIN ".$table." on ".$table.".id=language_mapping.external_id where ".$table.".id='".$id."' and language_mapping.type='".$type."'";
  
    echo $sql;
    if ($conn->query($sql) === TRUE) {
        echo "Record removed successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
   
}






function startAugmentation()
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


    $sql = " select id,title from details";
    $result = mysqli_query($conn, $sql);
    error_log('SQL query: ' . $sql); // debugging

    $classes= array();
    // loop over CLASSES results
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        $id = intval($row['id']);
        $name = $row['title'];

        $classes[] = array('id' => $id, 'name' => $name);

    }
    error_log('classes num rows: ' . count($classes));


    $sql = " select details.id,details.imgsrc,artworks.width,artworks.height from details join artworks on details.artwork=artworks.id";
    $result = mysqli_query($conn, $sql);
    error_log('SQL query: ' . $sql); // debugging

    $imagesData= array();
    // loop over IMAGES results
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        $id = intval($row['id']);
        $file_name = substr( $row['imgsrc'],9);
        $width = intval($row['width']);
        $height = intval($row['height']);

        $imagesData[] = array('id' => $id, 'file_name' => $file_name,'width' => $width,'height' => $height);

    }
    error_log('images num rows: ' . count($imagesData));


  
    $sql = " select id,lft,top,width,height from details";
    $result = mysqli_query($conn, $sql);
    error_log('SQL query: ' . $sql); // debugging

    $annotationsData = array();
    $bbox = array();
    // loop over ANNOTATION DATA results
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        $id = intval($row['id']);
        $image_id = intval($row['id']);
        $category_id = intval($row['id']);
        $lft = intval($row['lft']);
        $top = intval($row['top']);
        $width = intval($row['width']);
        $height = intval($row['height']);
        $bbox[0] = intval($lft);
        $bbox[1] = intval($width);
        $bbox[2] = intval($width);
        $bbox[3] = intval($height);

        $annotationsData[] = array('id' => $id, 'image_id' => $image_id, 'category_id' => $category_id, 'bbox' => $bbox);

    }
    error_log('details num rows: ' . count($annotationsData));


    $json_results = array();
    $json_results['categories'] = $classes;
    $json_results['images'] = $imagesData;
    $json_results['annotations'] = $annotationsData;


    error_log('JSON COCO annotation: ' . json_encode($annotationsData, JSON_PARTIAL_OUTPUT_ON_ERROR));
    echo json_encode($json_results);


//   write json to file:
    $jsonString=json_encode($json_results,JSON_PRETTY_PRINT);
    $parent_dir = dirname(__DIR__);
    $path=$parent_dir."/augmentation/image_coco.json";
    $fp=fopen($path,'w');
    fwrite($fp,$jsonString);
    fclose($fp);

    $sql ="SELECT artworks.imgsrc as img, details.imgsrc as det from artworks join details on artworks.id=details.artwork";
    $result = mysqli_query($conn, $sql);
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        $source = $parent_dir.substr( $row['img'],1);
        $dest = $parent_dir."/augmentation/".substr( $row['det'],9);
        if (copy($source, $dest) === false) {
        echo "WARNING: impossibile copiare l'immagine";
        }
    } 

    $conn->close();




// Start augmentation: poi leva commento
  // $resp=file_get_contents("http://".DB_AUGMENTATION."/cgi-bin/startcmd.py");
   //error_log('Augmentation server response: ' .$resp);

}


?>