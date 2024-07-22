<?php include('./server/config.php'); ?>
<!DOCTYPE html>
<html>
<head>

    <title>Collegati per amministrare il sito - <?php echo $sito_internet ?></title>

    <!--Pannello di gestione creato da Mel Riccardo-->
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
          <!--ReInHerit Smart Lens-->
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
</html>

