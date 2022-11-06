<?php
session_start();
if (!isset($_SESSION['name'])) {
    header("location: signUp.php");
}
$name = $_SESSION['name'];
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
                <a class="gameStart">START A NEW GAME</a>
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
        conn.onopen = function(e) {
            $("#messages").append(`<p class='fromSystem'><?php echo $name; ?> Has Joined The Chat</p>`);
            conn.send(`<p class='fromSystem'><?php echo $name; ?> Has Joined The Chat</p>`);
            $("#msgField").val("");
        };

        conn.onmessage = function(e) {
            $('#messages').append(`${e.data}`);
        };
        $("#msgField").keypress(function(e) {
            e.preventDefault;
            var key = e.which;
            var msgField = $("#msgField").val();
            if (key == 13) {
                $("#messages").append(`<p class='fromMe'>Me: ${msgField}</p>`);
                conn.send("<p class='fromOther'><?php echo $name; ?>: " + msgField + "</p>");
                $("#msgField").val("");
            }
        });
    </script>
</body>

</html>