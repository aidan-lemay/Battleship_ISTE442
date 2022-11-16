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
                const nRows = 1;
                const nCols = 1;

                for ( let i = 0; i < nRows; i++ ) {
                    let row = 0,
                        len = 2;

                    if ( ( i % 2 ) !== 0 ) {
                        row = 1;
                        len = 2;
                    }

                    for ( let j = 0; j < len; j++ ) {
                    cx = ( j + 1 ) * 100 + row;
                    cy = ( i + 1 ) * 80;

                    board += `<circle class='ships' cx='${cx}' cy='${cy}' r='20' id='p${i}${j}'
                                onmousedown='setMove( "p${i}${j}" );' />`;
                    }
                }

                document.getElementById( `board` ).innerHTML = board;
            }

            function releaseMouse() {
                if ( moverId ) {
                    let curX = document.getElementById(moverId).getAttribute('cx');
                    let curY = document.getElementById(moverId).getAttribute('cy');
                    let hit = checkHit(curX, curY);

                    if (!hit) {
                        let moverEle = document.getElementById(moverId);
                        moverEle.setAttribute('cx', myX);
                        moverEle.setAttribute('cy', myY);
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
                                        moverEle.setAttribute('cx', myX);
                                        moverEle.setAttribute('cy', myY);
                                    }
                                    else {
                                        moverEle.setAttribute('cx', drop.x + drop.width / 2);
                                        moverEle.setAttribute('cy', drop.y + drop.height/ 2);
                                    }
                                }
                            }
                        }

                    }
                    moverId = undefined;
                }
            }

            function setMove( id ) {
                moverId = id;

                myX = document.getElementById( moverId ).getAttribute( `cx` );
                myY = document.getElementById( moverId ).getAttribute( `cy` );

                }

            function moveMouse( evt ) {
                if ( moverId ) {

                    left = document.getElementsByTagName(`svg`)[0].getBoundingClientRect().left;
                    y =  document.getElementsByTagName(`svg`)[0].getBoundingClientRect().y;

                    // Prevents text selection while dragging elements
                    evt.preventDefault();

                    const moverEle = document.getElementById( moverId );

                    // actually change the location
                    moverEle.setAttribute( `cx`, evt.clientX-left );
                    moverEle.setAttribute( `cy`, evt.clientY-y );
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