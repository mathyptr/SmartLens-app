<?php

header('Content-type: application/json');
$id = $_GET['id'];
$table = $_GET['table'];
$req=$_GET['req'];
require_once("./server/config.php");
ini_set('display_errors', 1);
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
if (!$conn) {
    echo 'Connection error: ' . mysqli_connect_error();
}
/* change character set to utf8 | Object Oriented*/
if (!$conn->set_charset("utf8")) {
    error_log("Error loading character set utf8: %s\n", $conn->error);
}
$id = $conn->escape_string($id);

if($req==1)
    $sql = "SELECT * FROM ".$table." WHERE id=$id";

else if($req==2)
    $sql = "SELECT * FROM ".$table." WHERE artwork=$id";

else if($req==3)
    $sql = "SELECT * FROM ".$table;

error_log('SQL query: ' . $sql); // debugging
$result = mysqli_query($conn, $sql);

$detail = mysqli_fetch_all($result, MYSQLI_ASSOC);

mysqli_close($conn);

error_log('JSON details: ' . json_encode($detail, JSON_PARTIAL_OUTPUT_ON_ERROR));
// convert php to json
echo json_encode($detail);

?>