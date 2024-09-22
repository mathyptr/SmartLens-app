<?php
session_start(); //inizio la sessione
//includo i file necessari a collegarmi al db con relativo script di accesso

include("./server/config.php"); 
$connessione = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);

$username=$_POST['username'];
$password=sha1($_POST['password']);
//$password=($_POST['password']);

$sql = "SELECT * FROM login WHERE username = '$username' AND password = '$password' ";


//mathi
$result = mysqli_query($connessione, $sql);
// loop over results
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        $cod=$row['username'];
      
    }





/* Effettuo il controllo */
if ($cod == NULL) $trovato = 0 ;
else $trovato = 1;  

/* Username e password corrette */
if($trovato == 1) {

 /*Registro la sessione*/
  //session_register('autorizzato');

  $_SESSION["autorizzato"] = 1;

  /*Registro il codice dell'utente*/
  $_SESSION['cod'] = $cod;

 /*Redirect alla pagina riservata*/
   echo '<script language=javascript>document.location.href="areaRiservata.html"</script>'; 

} else {
/*Username e password errati, redirect alla pagina di login*/
$_SESSION['err']=1;
echo '<script language=javascript>document.location.href="login.php"</script>';
}
?>

