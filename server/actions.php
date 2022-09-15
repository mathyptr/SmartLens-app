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

    case "getDetail" :
        getDetail();
        break;

}


function getFeatures() {
    ini_set('display_errors', 1);
    $conn = new mysqli('localhost', 'tesi', 'tesi', 'tesi');
    if(!$conn){
        echo 'Connection error: '. mysqli_connect_error();
    }

    $sql = 'SELECT feature FROM features';

    $result = mysqli_query($conn, $sql);



    $row = mysqli_fetch_array($result);
    $features = json_decode($row['feature'], true);




    echo json_encode($features);
    mysqli_close($conn);
}

function getDetail() {
    if (isset($_POST['id'])) {
        $id = $_POST['id'];
    }else {
        echo "error";
        return;
    }
    ini_set('display_errors', 1);
    $conn = new mysqli('localhost', 'tesi', 'tesi', 'tesi');
    if(!$conn){
        echo 'Connection error: '. mysqli_connect_error();
    }
    $id = str_replace("./Particolari immagini", "", $id );
    $id = $conn-> escape_string('\\Adoration_of_the_Shepherds_(Giorgione)\\detail0_0\\0_0.png');
    $sql ="SELECT * FROM details WHERE id='$id'";

    $result = mysqli_query($conn, $sql);



    // cicla sul risultato
    $row = $result->fetch_array(MYSQLI_ASSOC);

    echo json_encode($row);
    mysqli_close($conn);
}





