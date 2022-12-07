const ROWS = 11,
    COLS = 11;
let sysTiles = [];
let placed = [];
let shipLoc = {
    'Battleship': '',
    'Carrier': '',
    'Cruiser': '',
    'Destroyer': '',
    'Submarine': ''
};
let myMoves = "";
let theirMoves = "";
let isExisting = false;
let isSelected = "";
let player = "",
    moverId,    //keeps track of what I'm dragging
    myX,
    myY;

function init(evt) {
    drawBoard();

    document.getElementsByTagName(`svg`)[0].addEventListener(`mousemove`, moveMouse);

    document.getElementsByTagName(`svg`)[0].addEventListener(`mouseup`, releaseMouse);

}

function drawBoard() {
    let board = ``,
        tboard = ``,
        x,
        y;

    let w = 70;

    // create board squares
    let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    let iCnt = 0;
    let jCnt = 0;
    let tiCnt = 0;
    let tjCnt = 0;
    let offX = 25;
    let offY = 45;

    // My Board
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            x = 70 * i + 350;
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
                        board += `<text x="${x + offX}" y="${y + offY}" font-size="20pt">${letters[iCnt]}</text>`;
                        iCnt++;
                    }
                }
                if (j == 0) {
                    if (i != 0) {
                        board += `<text x="${x + offX}" y="${y + offY}" font-size="20pt">${numbers[jCnt]}</text>`;
                        jCnt++;
                    }
                }
                sysTiles.push(`target_${i}${j}`);
            }

        }

    }

    // Their Board
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            x = 70 * i + 350;
            y = 70 * j + 0;

            if (i == 0 && j == 0) {
                tboard += `<rect x="${x}" y="${y}" width="${w}" height="${w}" stroke-width="2" stroke="black" fill="black" id="theirtarget_${i}${j}"></rect>`;
            }
            else {
                tboard += `<rect x="${x}" y="${y}" width="${w}" height="${w}" stroke-width="2" stroke="black" fill="white" id="theirtarget_${i}${j}" onmousedown='setSelect("theirtarget_${i}${j}")' ></rect>`;
            }



            if (i == 0 || j == 0) {
                if (i == 0) {
                    if (j != 0) {
                        tboard += `<text x="${x + offX}" y="${y + offY}" font-size="20pt">${letters[tiCnt]}</text>`;
                        tiCnt++;
                    }
                }
                if (j == 0) {
                    if (i != 0) {
                        tboard += `<text x="${x + offX}" y="${y + offY}" font-size="20pt">${numbers[tjCnt]}</text>`;
                        tjCnt++;
                    }
                }
                sysTiles.push(`theirtarget_${i}${j}`);
            }

        }

    }

    // create ships
    const sX = 10;
    const sY = 0;

    board += `<image x='${sX}' y='${sY}' width="${w - 10}" id="Battleship" href="./img/ships/battleship.min.svg" class="ships" onmousedown='setMove( "Battleship" );' />`;
    board += `<image x='${sX}' y='${sY + 20}' width="${w - 10}" id="Carrier" href="./img/ships/carrier.min.svg" class="ships" onmousedown='setMove( "Carrier" );' />`;
    board += `<image x='${sX}' y='${sY + 45}' width="${w - 10}" id="Cruiser" href="./img/ships/cruiser.min.svg" class="ships" onmousedown='setMove( "Cruiser" );' />`;
    board += `<image x='${sX}' y='${sY + 65}' width="${w - 10}" id="Destroyer" href="./img/ships/destroyer.min.svg" class="ships" onmousedown='setMove( "Destroyer" );' />`;
    board += `<image x='${sX}' y='${sY + 85}' width="${w - 10}" id="Submarine" href="./img/ships/submarine.min.svg" class="ships" onmousedown='setMove( "Submarine" );' />`;

    document.getElementById(`board`).innerHTML = board;
    document.getElementById(`theirboard`).innerHTML = tboard;

    (async () => {
        const response = await fetch('http://localhost:3000/getGameDetails', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const myJson = await response.json(); //extract JSON from the http response
        // do something with myJson

        if (response.status == 200) {

            shipLoc = myJson['myShips'];
            myMoves = myJson['myMoves'];
            theirMoves = myJson['theirMoves'];

            if (shipLoc['Battleship'] != '' && shipLoc['Carrier'] != '' && shipLoc['Cruiser'] != '' && shipLoc['Destroyer'] != '' && shipLoc['Submarine'] != '') {

                // Position Battleship
                let Battleship = document.getElementById('Battleship');
                let drop = document.getElementById(shipLoc['Battleship']).getBBox();

                Battleship.setAttribute('x', drop.x + drop.width / 2 - 30);
                Battleship.setAttribute('y', drop.y + drop.height / 2 - 5);
                Battleship.setAttribute('onmousedown', null);

                // Position Carrier
                let Carrier = document.getElementById('Carrier');
                drop = document.getElementById(shipLoc['Carrier']).getBBox();

                Carrier.setAttribute('x', drop.x + drop.width / 2 - 30);
                Carrier.setAttribute('y', drop.y + drop.height / 2 - 5);
                Carrier.setAttribute('onmousedown', null);

                // Position Cruiser
                let Cruiser = document.getElementById('Cruiser');
                drop = document.getElementById(shipLoc['Cruiser']).getBBox();

                Cruiser.setAttribute('x', drop.x + drop.width / 2 - 30);
                Cruiser.setAttribute('y', drop.y + drop.height / 2 - 5);
                Cruiser.setAttribute('onmousedown', null);

                // Position Destroyer
                let Destroyer = document.getElementById('Destroyer');
                drop = document.getElementById(shipLoc['Destroyer']).getBBox();

                Destroyer.setAttribute('x', drop.x + drop.width / 2 - 30);
                Destroyer.setAttribute('y', drop.y + drop.height / 2 - 5);
                Destroyer.setAttribute('onmousedown', null);

                // Position Submarine
                let Submarine = document.getElementById('Submarine');
                drop = document.getElementById(shipLoc['Submarine']).getBBox();

                Submarine.setAttribute('x', drop.x + drop.width / 2 - 30);
                Submarine.setAttribute('y', drop.y + drop.height / 2 - 5);
                Submarine.setAttribute('onmousedown', null);

                // Disable Submit Button
                document.getElementById('submitBoardDiv').hidden = true;

                // Add My Already Played Buttons
                for (let key in myMoves) {
                    if (key != 'Zero' && myMoves[key] != 'Zero') {
                        let cell = document.getElementById(`their${key}`);
                        if (myMoves[key]) {
                            cell.style.fill = 'green';
                        }
                        else {
                            cell.style.fill = 'red';
                        }
                        cell.setAttribute('onmousedown', null);
                    }
                    
                }

                // Add Their Already Played Buttons
                for (let key in theirMoves) {
                    if (key != 'Zero' && theirMoves[key] != 'Zero') {
                        let cell = document.getElementById(key);
                        if (theirMoves[key]) {
                            cell.style.fill = 'green';
                        }
                        else {
                            cell.style.fill = 'red';
                        }
                        cell.setAttribute('onmousedown', null);
                    }
                }
            }

        }
    })();
}

function setSelect(id) {
    let sys = false;

    for (let x in sysTiles) {
        if (sysTiles[x] == id) {
            sys = true;
        }
    }

    if (!sys) {
        if (isSelected.length > 0) {
            document.getElementById(isSelected).style.fill = 'white';
        }

        document.getElementById(id).style.fill = 'yellow';
        isSelected = id;
    }
}

function setMove(id) {
    moverId = id;

    myX = document.getElementById(moverId).getAttribute(`x`);
    myY = document.getElementById(moverId).getAttribute(`y`);
}

function moveMouse(evt) {
    if (moverId) {

        let left = document.getElementsByTagName(`svg`)[0].getBoundingClientRect().left;
        let y = document.getElementsByTagName(`svg`)[0].getBoundingClientRect().y;

        // Prevents text selection while dragging elements
        evt.preventDefault();

        const moverEle = document.getElementById(moverId);

        // actually change the location
        moverEle.setAttribute(`x`, evt.clientX - left);
        moverEle.setAttribute(`y`, evt.clientY - y);
    }
}

function releaseMouse() {
    if (moverId) {
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
                        let isSys = false;

                        for (let x in sysTiles) {
                            if (sysTiles[x] == `target_${i}${j}`) {
                                isSys = true;
                            }
                        }
                        for (let x in placed) {
                            if (placed[x] == `target_${i}${j}`) {
                                isSys = true;
                            }
                        }

                        if (isSys) {
                            moverEle.setAttribute('x', myX);
                            moverEle.setAttribute('y', myY);
                        }
                        else {
                            moverEle.setAttribute('x', drop.x + drop.width / 2 - 30);
                            moverEle.setAttribute('y', drop.y + drop.height / 2 - 5);
                            shipLoc[moverId] = `target_${i}${j}`;
                            placed.push(`target_${i}${j}`);
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
                if (!placed.includes(`target_${i}${j}`)) {
                    return true;
                }
            }
        }
    }
}