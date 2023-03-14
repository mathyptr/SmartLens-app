<?php

header('Content-type: application/json');
$id = $_GET['id'];
$lang = $_GET['lang'];
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
$sql = "SELECT * FROM details_".$lang." WHERE id='$id'";

error_log('SQL query: ' . $sql); // debugging
$result = mysqli_query($conn, $sql);

$detail = mysqli_fetch_all($result, MYSQLI_ASSOC);

mysqli_close($conn);

error_log('JSON details: ' . json_encode($detail, JSON_PARTIAL_OUTPUT_ON_ERROR));
// convert php to json
echo json_encode($detail);

?>
