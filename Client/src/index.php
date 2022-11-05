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
    <style type="text/css">
    </style>
</head>

<body>
    <div class="center-body">
        <h1>Battleship - Lobby Chat</h1>
        <hr />

        <div class="gameStart">
            <button class="gameStart">START A NEW GAME</button>
        </div>
        
        <div class="gameStart">
            <a class="gameStart" href="signOut.php">LOGOUT</a>
        </div>

        <div class="chatbox" id="chatbox">
            <div id="messages"></div>
            <textarea name="msg" id="msgField" class="msgField"></textarea>
        </div>
    </div>

    <script type="text/javascript">
        var conn = new WebSocket('ws://localhost:8080');
        conn.onopen = function(e) {
            $('#uStatus').html("<?php echo $name; ?> <span style='color:green;'>[active]</span>");
        };

        conn.onmessage = function(e) {
            $('#messages').append(`<p class='fromOther'>${e.data}</p>`);
        };
        $("#msgField").keypress(function(e) {
            e.preventDefault;
            var key = e.which;
            var msgField = $("#msgField").val();
            if (key == 13) {
                $("#messages").append(`<p class='fromMe'>Me: ${msgField}</p>`);
                conn.send("<?php echo $name; ?>: " + msgField);
                $("#msgField").val("");
            }
        });
    </script>
</body>

</html>