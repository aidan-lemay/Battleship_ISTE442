const express = require('express');
const router = express.Router();
const { GameBoards } = require('../db/model');

function getTimeStamp(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}T${date.getHours()}:${date.getMinutes()}.${date.getSeconds()}`
}

router.post('/', async (req, res) => {

    const result = await GameBoards.findOne({gameID: req.body.gameID}, {gameID: 1});

    if (result.gameID > 0) {
        // Update Game Board Since ID Exist
        const updatedData = {
            user1Board: req.body.user1Board,
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
            const dataToSave = await GameBoards.findOne({"_id": dta._id});
            res.status(200).json({"id": dataToSave.gameID});
        }
        catch (error) {
            res.status(400).json({message: error.message})
        }
    }

});

module.exports = router;