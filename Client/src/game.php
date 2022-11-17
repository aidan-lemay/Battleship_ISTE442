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
    <title>Battleship</title>
    <script src="./assets/jquery-3.6.1.min.js"></script>
    <link rel="stylesheet" href="./assets/css/gameStyles.css"></link>
</head>

<body>
    <div class="center-body">
        <h1>Battleship</h1>
        <hr />

        <div class="barButtons">
            <div class="gameStart">
                <a class="gameStart" href="./index.php">RETURN TO LOBBY</a>
            </div>
            
            <div class="logOut">
                <a class="logOut" href="signOut.php">LOGOUT</a>
            </div>
        </div>

        <script>
            var conn = new WebSocket('ws://localhost:8080');

            const ROWS = 11,
                  COLS = 11;
            sysTiles = [];
            let player = "Aidan",
                moverId,    //keeps track of what I'm dragging
                myX,
                myY;

            function init( evt ) {
                drawBoard();

                document.getElementsByTagName( `svg` )[0].addEventListener( `mousemove`, moveMouse );

                document.getElementsByTagName( `svg` )[0].addEventListener( `mouseup`, releaseMouse );

            }

            function drawBoard() {
                let board = ``,
                    x,
                    y,
                    color,
                    cx,
                    cy;

                let w = 70;

                // create board squares
                letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
                numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
                iCnt = 0;
                jCnt = 0;
                offX = 25;
                offY = 45;

                for ( let i = 0; i < ROWS; i++ ) {
                    for ( let j = 0; j < COLS; j++ ) {
                        x = 70 * i + 550;
                        y = 70 * j + 0;

                        if (i == 0 && j == 0) {
                            board += `<rect x="${x}" y="${y}" width="${w}" height="${w}" stroke-width="2" stroke="black" fill="black" id="target_${i}${j}"></rect>`;
                        }
                        else {
                            board += `<rect x="${x}" y="${y}" width="${w}" height="${w}" stroke-width="2" stroke="black" fill="white" id="target_${i}${j}"></rect>`;
                        }

                        
                        
                        if (i == 0 || j == 0) {
                            if (i == 0) {
                                if (j != 0) {
                                    board += `<text x="${x+offX}" y="${y+offY}" font-size="20pt">${letters[iCnt]}</text>`;
                                    iCnt ++;
                                }
                            }
                            if (j == 0) {
                                if (i != 0) {
                                    board += `<text x="${x+offX}" y="${y+offY}" font-size="20pt">${numbers[jCnt]}</text>`;
                                    jCnt ++;
                                }
                            }
                            sysTiles.push(`target_${i}${j}`);
                        }
                
                    }
                    
                }

                // create ships

                const sX = 10;
                const sY = 0;

                board += `<image x='${sX}' y='${sY}' width="${w - 10}" id="Battleship" href="./assets/img/ships/battleship.min.svg" class="ships" onmousedown='setMove( "Battleship" );' />`;
                board += `<image x='${sX}' y='${sY + 20}' width="${w - 10}" id="Carrier" href="./assets/img/ships/carrier.min.svg" class="ships" onmousedown='setMove( "Carrier" );' />`;
                board += `<image x='${sX}' y='${sY + 45}' width="${w - 10}" id="Cruiser" href="./assets/img/ships/cruiser.min.svg" class="ships" onmousedown='setMove( "Cruiser" );' />`;
                board += `<image x='${sX}' y='${sY + 65}' width="${w - 10}" id="Destroyer" href="./assets/img/ships/destroyer.min.svg" class="ships" onmousedown='setMove( "Destroyer" );' />`;
                board += `<image x='${sX}' y='${sY + 85}' width="${w - 10}" id="Submarine" href="./assets/img/ships/submarine.min.svg" class="ships" onmousedown='setMove( "Submarine" );' />`;

                document.getElementById( `board` ).innerHTML = board;
            }

            function setMove( id ) {
                moverId = id;

                myX = document.getElementById( moverId ).getAttribute( `x` );
                myY = document.getElementById( moverId ).getAttribute( `y` );
            }

            function moveMouse( evt ) {
                if ( moverId ) {

                    left = document.getElementsByTagName(`svg`)[0].getBoundingClientRect().left;
                    y =  document.getElementsByTagName(`svg`)[0].getBoundingClientRect().y;

                    // Prevents text selection while dragging elements
                    evt.preventDefault();

                    const moverEle = document.getElementById( moverId );

                    // actually change the location
                    moverEle.setAttribute( `x`, evt.clientX-left );
                    moverEle.setAttribute( `y`, evt.clientY-y );
                }
            }

            function releaseMouse() {
                if ( moverId ) {
                    let curX = document.getElementById(moverId).getAttribute('x');
                    let curY = document.getElementById(moverId).getAttribute('y');
                    let hit = checkHit(curX, curY);

                    if (!hit) {
                        let moverEle = document.getElementById(moverId);
                        moverEle.setAttribute('x', myX);
                        moverEle.setAttribute('y', myY);
                    }
                    else {

                        for (let i = 0; i < ROWS; i++) {
                            for (let j = 0; j < COLS; j++) {
                                let moverEle = document.getElementById(moverId);
                                const drop = document.getElementById(`target_${i}${j}`).getBBox();

                                if (curX > drop.x && curX < (drop.x + drop.width) && curY > drop.y && curY < (drop.x + drop.height)) {
                                    isSys = false;

                                    for (x in sysTiles) {
                                        if (sysTiles[x] == `target_${i}${j}`) {
                                            isSys = true;
                                        }
                                    }
                                    
                                    if (isSys) {
                                        moverEle.setAttribute('x', myX);
                                        moverEle.setAttribute('y', myY);
                                    }
                                    else {
                                        moverEle.setAttribute('x', drop.x + drop.width / 2 - 30);
                                        moverEle.setAttribute('y', drop.y + drop.height/ 2 - 5);
                                    }
                                }
                            }
                        }

                    }
                    moverId = undefined;
                }
            }

            function checkHit(x, y) {

                for (let i = 0; i < ROWS; i++) {
                    for (let j = 0; j < COLS; j++) {
                        const drop = document.getElementById(`target_${i}${j}`).getBBox();

                        if (x > drop.x && x < (drop.x + drop.width) && y > drop.y && y < (drop.x + drop.height)) {
                            return true
                        }
                    }
                }
            }
        </script>
        
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="2000px" height="1000px" onload="init();">
            <g id="board"></g>
        </svg>

    </div>
</body>

</html>