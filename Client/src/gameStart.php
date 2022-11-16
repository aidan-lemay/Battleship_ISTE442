<?php
session_start();
if (!isset($_SESSION['name'])) {
    header("location: signUp.php");
}
$name = $_SESSION['name'];
$uid = $_SESSION['uid'];
include_once('./assets/db/db.class.php');
$db = new DB();
?>
<!DOCTYPE html>
<html>

<head>
    <title>Battleship - Start a Game</title>
    <script src="./assets/jquery-3.6.1.min.js"></script>
    <link rel="stylesheet" href="./assets/css/styles.css"></link>
</head>

<body>
    <div class="center-body">
        <h1>Battleship - Start a Game</h1>
        <hr />

        <div class="barButtons">
            <div class="gameStart">
                <a class="gameStart" href="./index.php">RETURN TO LOBBY</a>
            </div>
            
            <div class="logOut">
                <a class="logOut" href="signOut.php">LOGOUT</a>
            </div>
        </div>
        

    </div>

    <script type="text/javascript">
        var conn = new WebSocket('ws://localhost:8080');

    </script>
</body>

</html>