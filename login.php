<?php include('./server/config.php'); ?>



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
    </nav>
<h3 id="logTitle" >Login</h3>
<form id="myForm" action="verifica.php" method="post">
  <div class="container">
    <label for="user"><b>Username</b></label>
    <input id="user" type="text" placeholder="Enter Username" name="username" required >

    <label for="pw"><b>Password</b></label>
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
function notifyError(){
    var user= document.getElementById("user");
    var pw= document.getElementById("pw");
    var msg= document.getElementById("logTitle");
    user.style.backgroundColor="rgb(231, 178, 178)";
    //user.style.backgroundColor="rgb(241, 138, 138)";
    user.style.border="1px solid red";
   // pw.style.backgroundColor="rgb(241, 138, 138)";
    pw.style.backgroundColor="rgb(231, 178, 178)";
    pw.style.border="1px solid red";
    msg.innerText="Error: try again.";
    setTimeout(() => {  
            user.style.backgroundColor="white";
            user.style.border="1px solid #ccc"; 
            pw.style.backgroundColor="white";
            pw.style.border="1px solid #ccc"; 
    }, 800);
    
}
</script>


<?php 

session_start();

if(isset($_SESSION["err"])&&($_SESSION["err"])==1)
  echo '<script language=javascript>notifyError();</script>';

$_SESSION = array();
session_destroy();
?>