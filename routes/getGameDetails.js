const express = require('express');
const router = express.Router();
const { GameBoards } = require('../db/model');
const config = process.env;
const jwt = require("jsonwebtoken");

// Get Existing Game Details
router.get('/', async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, config.JWT_KEY);
    let myShips = "";
    let myMoves = "";
    let theirMoves = "";
    let found = true;
    let youWin = null;

    const result = await GameBoards.findOne({ $or: [{ user1ID: decoded['user_id'] }, { user2ID: decoded['user_id'] }] });

    if (result != null) {
        if (result.user1ID == decoded['user_id']) {
            myShips = result.user1Board;
            myMoves = result.user1Plays;
            theirMoves = result.user2Plays;

            if (result.user1Win) {
                youWin = true;
            }
            else if (result.user2Win) {
                youWin = false;
            }
        }
        else if (result.user2ID == decoded['user_id']) {
            myShips = result.user2Board;
            myMoves = result.user2Plays;
            theirMoves = result.user1Plays;

            if (result.user2Win) {
                youWin = true;
            }
            else if (result.user1Win) {
                youWin = false;
            }
        }
        else {
            found = false;
            res.status(404).json({ "error": "User ID Not Found" });
        }

        if (found) {
            let retVal = {};
            if (youWin != null) {
                retVal = {
                    myShips: myShips,
                    myMoves: myMoves,
                    theirMoves: theirMoves,
                    youWin: youWin
                }
            }
            else {
                retVal = {
                    myShips: myShips,
                    myMoves: myMoves,
                    theirMoves: theirMoves
                }
            }
            res.status(200).json(retVal);
        }
    }
    else {
        res.status(404).json({ "game": "User Is Not In Game" });
    }
});

module.exports = router;