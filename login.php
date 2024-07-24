<?php include('./server/config.php'); 
session_start();
?>

<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>

/* Change styles for span and cancel button on extra small screens */

</style>
<link href="css/indexStyle.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
<link href="css/login.css" rel="stylesheet" type="text/css" />
</head>
<body>
<nav class="navbar">
      <div class="logo-container">
        <img
          id="logo"
          src="images/Reinherit-Logo(31x30).jpg"
          alt="ReInHerit logo"
          class="responsive-image"
        />
        <h2 id="title">
          ReInHerit Smart Lens
        </h2>
      </div>
      <div id="languageContainer">
        <a id="English" onclick=setEn()>English</a>
        <a id="Italian" onclick=setIt()>Italiano</a>
      </div>
    </nav>
<h3 id="logTitle" >Login</h3>
<form id="myForm" action="verifica.php" method="post">
  <div class="container">
    <label for="user"></label>
    <input id="user" type="text" placeholder="Enter Username" name="username" required >

    <label for="pw"></label>
    <input id="pw" type="password" placeholder="Enter Password" name="password" required>
    <div id="sub"><input type="submit" id="submit" value="Login"></div>
  </div>

  <div id="foot" class="container">
    <a href="index.html"><span id="exit" class="material-symbols-outlined">reply</span></a>
  </div>
</form>

</body>
</html>

<script language=javascript>
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

window.onload= function (){
  if(getCookie("language")=="en")
    setEn();
  else
    setIt();
}

function notifyError(){
    var user= document.getElementById("user");
    var pw= document.getElementById("pw");
    user.style.backgroundColor="rgb(231, 178, 178)";
    //user.style.backgroundColor="rgb(241, 138, 138)";
    user.style.border="1px solid red";
   // pw.style.backgroundColor="rgb(241, 138, 138)";
    pw.style.backgroundColor="rgb(231, 178, 178)";
    pw.style.border="1px solid red";
    setMsg();
    setTimeout(() => {  
            user.style.backgroundColor="white";
            user.style.border="1px solid #ccc"; 
            pw.style.backgroundColor="white";
            pw.style.border="1px solid #ccc"; 
    }, 800);
}

function setEn(){
  var label=[];
  label=document.getElementsByTagName("label");
  var user= document.getElementById("user");
  var pw= document.getElementById("pw");
  label[0].innerText="Username";
  label[1].innerText="Password";
  user.placeholder="Enter username";
  pw.placeholder="Enter password";
  document.getElementById("English").style.borderBottom="2px solid black";
  document.getElementById("Italian").style.borderBottom="2px solid transparent";
  setCookie("language","en",1);
  if(document.getElementById("logTitle").innerText!="Login")
    setMsg();
}
function setIt(){
  var label=[];
  label=document.getElementsByTagName("label");
  var user= document.getElementById("user");
  var pw= document.getElementById("pw");
  label[0].innerText="Utente";
  label[1].innerText="Password";
  user.placeholder="Inserire utente";
  pw.placeholder="Inserire password";
  document.getElementById("Italian").style.borderBottom="2px solid black";
  document.getElementById("English").style.borderBottom="2px solid transparent";
  setCookie("language","it",1);
  if(document.getElementById("logTitle").innerText!="Login")
    setMsg();
}

function setMsg(){
  var error;
  var msg= document.getElementById("logTitle");
  if(getCookie("language")=="en")
      error="Error: try again.";
  else
      error="Errore: riprova.";
  msg.innerText=error;//"Error: try again.";
}
</script>


<?php 
if(isset($_SESSION["err"])&&($_SESSION["err"])==1)
  echo '<script language=javascript>notifyError();</script>';

$_SESSION = array();
session_destroy();
?>