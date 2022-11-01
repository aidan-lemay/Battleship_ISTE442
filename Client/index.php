<?php
    include_once "./classes/db.class.php";
    include_once "./classes/variables.php";
    $db = new DB();
?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]>      <html class="no-js"> <![endif]-->
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <link rel="stylesheet" href="">
    </head>
    <body>
        <?php
            if (isset($_COOKIE['gameID'])) {
                echo `Game Set`;
            }
            else {
                echo $chatPage;
            }
        ?>
    </body>
</html>