const express = require('express');
const router = express.Router();
const { GameBoards } = require('../db/model');
const config = process.env;
const jwt = require("jsonwebtoken");

function getTimeStamp(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}T${date.getHours()}:${date.getMinutes()}.${date.getSeconds()}`
}

// Create New Game
router.post('/', async (req, res) => {
    // Make Sure Neither Player Is In Game
    // Update Player Status to "In Game"
    // Create Game ID
    // Assign Player1 and Player2
});

// Update Current Game With Board Positions
router.put('/', async (req, res) => {
    // Make Sure Player Is In Game
    // Get UserID (Token) and GameID (Request)
    // From UserID, 
    const decoded = jwt.verify(req.cookies.token, config.JWT_KEY);

    console.log(decoded['user_id']);

    const result = await GameBoards.findOne({ gameID: req.body.gameID }, { gameID: 1 });
    if (result.gameID > 0) {

        if (req.body.user1ID != null) {
            // Update Game Board 1 Since ID Exist
            const updatedData = {
                user1Board: req.body.user1Board,
                timeStamp: Date.now()
            }

            GameBoards.updateOne({ "_id": result._id }, updatedData, function (err, result) {
                if (err !== null) {
                    res.status(500).json(err);
                }
                else {
                    res.status(200).json({ "gameID": result.gameID, "updatedAt": getTimeStamp(Date.now()) });
                }
            });
        }
        else if (req.body.user2ID != null) {
            // Update Game Board 2 Since ID Exist
            const updatedData = {
                user2Board: req.body.user2Board,
                timeStamp: Date.now()
            }

            GameBoards.updateOne({ "_id": result._id }, updatedData, function (err, result) {
                if (err !== null) {
                    res.status(500).json(err);
                }
                else {
                    res.status(200).json({ "gameID": result.gameID, "updatedAt": getTimeStamp(Date.now()) });
                }
            });
        }
    }
    else {
        // Create New Game Board Since ID Not Exist
        const data = new GameBoards({
            gameID: req.body.gameID,
            user1ID: req.body.user1ID,
            user1Board: req.body.user1Board,
            user2ID: req.body.user2ID,
            user2Board: req.body.user2Board,
            timeStamp: Date.now()
        });

        try {
            const dta = await data.save();
            const dataToSave = await GameBoards.findOne({ "_id": dta._id });
            res.status(200).json({ "id": dataToSave.gameID });
        }
        catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

});

module.exports = router;