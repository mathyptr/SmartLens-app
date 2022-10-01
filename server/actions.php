<?php


/* setta il formato di risposta */
header('Content-Type: text/json');
require_once("config.php");

$action = $_POST['action'];

/* conterrà la stringa di query al database */
$query_string = "";

/* smista secondo il tipo di richiesta */
switch($action) {

    case "getFeatures" :
        //echo($action);
        getFeatures();
        break;

    case "getDetailIta" :
        getDetailIta();
        break;

    case "getDetailEn" :
        getDetailEn();
        break;

}


function getFeatures() {
    ini_set('display_errors', 1);
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    if(!$conn){
        echo 'Connection error: '. mysqli_connect_error();
    }

    $sql = 'SELECT * FROM pythonfeatures';

    $result = mysqli_query($conn, $sql);



    $features = array();

    // cicla sul risultato
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {

        $artwork = $row['artwork'];
        $detail_features = $row['features'];


        $feature = array('artwork' => $artwork,'features' =>$detail_features);
        array_push($features, $feature);
    }

    echo json_encode($features);
    mysqli_close($conn);
}

function getDetailIta() {
    if (isset($_POST['id'])) {
        $id = $_POST['id'];
    }else {
        echo "error";
        return;
    }
    ini_set('display_errors', 1);
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    if(!$conn){
        echo 'Connection error: '. mysqli_connect_error();
    }

    $id = $conn-> escape_string($id);
    $sql ="SELECT * FROM details WHERE id='$id'";

    $result = mysqli_query($conn, $sql);


    $row = $result->fetch_array(MYSQLI_ASSOC);

    echo json_encode($row);
    mysqli_close($conn);
}

function getDetailEn() {
    if (isset($_POST['id'])) {
        $id = $_POST['id'];
    }else {
        echo "error";
        return;
    }
    ini_set('display_errors', 1);
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
    if(!$conn){
        echo 'Connection error: '. mysqli_connect_error();
    }

    $id = $conn-> escape_string($id);
    $sql ="SELECT * FROM detailsEn WHERE id='$id'";

    $result = mysqli_query($conn, $sql);


    $row = $result->fetch_array(MYSQLI_ASSOC);

    echo json_encode($row);
    mysqli_close($conn);
}





