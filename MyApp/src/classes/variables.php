<?php
    $chatPage = '<<<EOD<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="./assets/css/styles.css"></link>
        <title>Battleship - Lobby</title>
    </head>
    <body>
        <div class="center-body">
            <h1>Battleship - Lobby Chat</h1>
            <hr />
    
            <div class="gameStart">
                <button class="gameStart">START A NEW GAME</button>
            </div>
    
            <div class="chatbox">
                <p class="fromMe">
                    Test Message From Me
                </p>
                <p class="fromOther">
                    Test Message From Other
                </p>
    
                <form class="sendBox" method="POST">
                    <textarea></textarea>
                    <input type="submit" value="Send">
                </form>
            </div>
        </div>
    </body>
    </html>EOD';
?>