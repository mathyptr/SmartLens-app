<?php include('./server/config.php'); ?>
<!-- 
<!DOCTYPE html>
<html>
<head>

    <title>Collegati per amministrare il sito - <?php echo $sito_internet ?></title>

    <link href="css/login.css" rel="stylesheet" type="text/css" />
    <link href="css/indexStyle.css" rel="stylesheet" type="text/css" />
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
    <form id="login" action="verifica.php" method="post">
        <fieldset id="inputs">
            <input id="username" name="username" type="text" placeholder="Username" autofocus required>
            <input id="password" name="password" type="password" placeholder="Password" required>
            <div>
                <input type="submit" id="submit" value="Login">
                <a href="index.html"> <input id="back" value="Back"></a>
            </div>
        </fieldset>
    </form>

</body>
</html>-->

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

<form id="myForm" action="verifica.php" method="post">
  <div class="container">
    <label for="username"><b>Username</b></label>
    <input id="n" type="text" placeholder="Enter Username" name="username" required>

    <label for="password"><b>Password</b></label>
    <input id="p" type="password" placeholder="Enter Password" name="password" required>
    <div id="sub"><input type="submit" id="submit" value="Login"></div>
  </div>

  <div id="foot" class="container">
    <a href="index.html"><span id="exit" class="material-symbols-outlined">reply</span></a>
  </div>
</form>

</body>
</html>