<?php

header('Content-type: application/json');
$id = $_GET['id'];
$language = $_GET['language'];
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

/*$sql =  "SELECT * FROM details join 
(select artworks.id as idArtwork, artworks.title as titleArtwork, author from artworks)
 art on art.idArtwork=artwork WHERE id='$id'";*/

 $sql = "select language.data as description, details.title,details.confidence, details.imgsrc, art.idArtwork, art.titleArtwork, art.author from language join language_mapping on language_mapping.data=language.id join details on details.id=language_mapping.external_id join (select artworks.id as idArtwork, artworks.title as titleArtwork, author from artworks) art on art.idArtwork=artwork where type='detail' and language.language='".$language."' and details.id=$id";

/*$sql =  "select * from language join language_mapping on language_mapping.data=language.id 
join details on details.id=language_mapping.external_id join 
(select artworks.id as idArtwork, artworks.title as titleArtwork, author from artworks)
art on art.idArtwork=artwork
where type='detail' and language.language='".$language."' and details.id=$id";*/




error_log('SQL query: ' . $sql); // debugging
$result = mysqli_query($conn, $sql);

$detail = mysqli_fetch_all($result, MYSQLI_ASSOC);

mysqli_close($conn);

error_log('JSON details: ' . json_encode($detail, JSON_PARTIAL_OUTPUT_ON_ERROR));
// convert php to json
echo json_encode($detail);

?>
