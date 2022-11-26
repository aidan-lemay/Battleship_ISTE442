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
    <title>Battleship - Chat</title>
    <script src="./assets/jquery-3.6.1.min.js"></script>
    <link rel="stylesheet" href="./assets/css/styles.css"></link>
</head>

<body>
    <div class="center-body">
        <h1>Battleship - Lobby Chat</h1>
        <hr />

        <div class="barButtons">
            <div class="gameStart">
                <a class="gameStart" href="./game.php">START A NEW GAME</a>
            </div>
            
            <div class="logOut">
                <a class="logOut" href="signOut.php">LOGOUT</a>
            </div>
        </div>
        

        <div class="chatbox" id="chatbox">
            <div id="messages"></div>
            <textarea name="msg" id="msgField" class="msgField"></textarea>
        </div>
    </div>

    <script type="text/javascript">
        var conn = new WebSocket('ws://localhost:8080');

        var sanitizeHTML = function (str) {
            return str.replace(/[^\w. ]/gi, function (c) {
                return '&#' + c.charCodeAt(0) + ';';
            });
        };

        conn.onopen = function() {
            $("#messages").append(`<p class='fromSystem'><?php echo $name; ?> Has Joined The Chat</p>`);
            conn.send(`<p class='fromSystem'><?php echo $name; ?> Has Joined The Chat</p>`);
            $("#msgField").val("");
        };

        conn.onmessage = function(e) {
            $('#messages').append(`${e.data}`);
        };

        conn.onclose = function(){
            conn.send(`<p class='fromSystem'><?php echo $name; ?> Has Left The Chat</p>`);
            $("#msgField").val("");
        };

        $("#msgField").keypress(function(e) {
            e.preventDefault;
            var key = e.which;
            var msgField = sanitizeHTML($("#msgField").val());
            // need to get contents of msgfield into php ... api?
            if (key == 13) {
                $("#messages").append(`<p class='fromMe'>Me: ${msgField}</p>`);
                conn.send("<p class='fromOther'><?php echo $name; ?>: " + msgField + "</p>");
                $("#msgField").val("");
            }
        });
    </script>
</body>

</html>