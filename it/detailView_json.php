<?php

header('Content-type: application/json');
$id = $_GET['id'];
$lang = $_GET['lang'];
require_once("../server/config.php");
ini_set('display_errors', 1);
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
if (!$conn) {
    echo 'Connection error: ' . mysqli_connect_error();
}
$id = $conn->escape_string($id);
$sql = "SELECT * FROM details_".$lang." WHERE id='$id'";

$result = mysqli_query($conn, $sql);

$detail = mysqli_fetch_all($result, MYSQLI_ASSOC);

mysqli_close($conn);

// convert php to json
echo json_encode($detail);

?>
