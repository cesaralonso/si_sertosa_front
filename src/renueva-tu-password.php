<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Renueva tu contraseña | Plataforma x</title>
  <link rel="manifest" href="manifest.json">

  <link rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-touch-icon180X180.png">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="assets/icons/favicon16x16.png">
  <meta name="msapplication-TileColor" content="#213758">
  <meta name="theme-color" content="#213758"> 
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <style>
    body, html {
      padding: 0;
      margin: 0;
    }
    .auth-main {
      display: flex;
      align-items: center;
      height: 100%;
      width: 100%;
      position: absolute;
      background-image: url(assets/img/sky-bg.jpg);
    }
    .auth-block {
      width: 540px;
      margin: 0 auto;
      border-radius: 5px;
      background: rgba(0,0,0,.6);
      color: #fff;
      padding: 32px;
    }
    .main {
      min-height: 100%;
      font: 14px/16px Roboto,sans-serif;
      color: #333;
      background-color: #f0f3f4;
    }
    .text-center {
      text-align: center;
    }
    a {
      color: white;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="main">
    <div class="auth-main">

      <div class="auth-block text-center">
        <div class="text-center m-5">
          <picture>
            <source media="min-width: 320px" srcset="./assets/img/logo.png"><img alt="Logo " src="./assets/img/logo.png" width="200">
          </picture>
        </div>
        <h1>Renueva tu contraseña</h1>
        <?php
        if (!$_GET["code"] || !$_GET["email"]) {
          echo "<p><strong>ERROR. ¡NO HAY UN CÓDIGO O EMAIL VÁLIDO EN EL ENLACE!.</strong></p>";
        } else {
          $code = $_GET["code"];
          $email = $_GET["email"];

          if (!$_POST["password"] || !$_POST["passwordRe"]) {
        ?>

        <form class="form-horizontal" method="post" action="renueva-tu-password.php?code=<?php echo $code; ?>&email=<?php echo $email; ?>">
          <div class="form-group row">
            <label for="password" class="col-sm-3 control-label">Nueva contraseña</label>

            <div class="col-sm-9">
              <input type="password" class="form-control" id="password" name="password">
            </div>
          </div>
          <div class="form-group row">
            <label for="passwordRe" class="col-sm-3 control-label">Repite la nueva contraseña</label>

            <div class="col-sm-9">
              <input type="password" class="form-control" id="passwordRe" name="passwordRe">
            </div>
          </div>
          <div class="form-group row">
            <div class="offset-sm-3 col-sm-9">
              <button type="submit" class="btn btn-default btn-auth">Establecer la nueva contraseña</button>
            </div>
          </div>
        </form>

        <?php
          }  else {
            if ($_POST["password"] === $_POST["passwordRe"]) {

              $password = $_POST["password"];
              $passwordRe = $_POST["passwordRe"];

              $ch = curl_init();
              curl_setopt($ch, CURLOPT_URL, "https://plataforma-x.com/api/si_user/cambia-password/$email/$code");
              curl_setopt($ch, CURLOPT_POST, 1);
              curl_setopt($ch, CURLOPT_POSTFIELDS, "password=$password&passwordRe=$passwordRe");
              curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

              $res = JSON_DECODE(curl_exec($ch));
              if ($res->success) {
                echo "<p><strong>$res->message</strong></p>";
                echo "<p>Ahora puedes <a href='index.html'><strong>Ingresar a Portal Clientes</strong></a></p>";
              } else {
                echo "<p><strong>Error: $res->message</strong></p>";
              }
              curl_close($ch);
            } else {
              echo "<h2><strong>¡Las contraseñas no coinciden!.</strong></h2>";
            }
          }
        }
        ?>
      </div>
    </div>
  </div>
</body>
</html>
