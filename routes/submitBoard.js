const express = require('express');
const router = express.Router();
const { GameBoards } = require('../db/model');
const config = process.env;
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');

function getTimeStamp(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}T${date.getHours()}:${date.getMinutes()}.${date.getSeconds()}`
}

// Update Current Game With Board Positions
router.put('/', async (req, res) => {
    // Make Sure Player Is In Game
    const decoded = jwt.verify(req.cookies.token, config.JWT_KEY);

    const result = await GameBoards.findOne({ $or: [{ user1ID: decoded['user_id'] }, { user2ID: decoded['user_id'] }] });
    if (result._id != undefined) {
        let updatedData = {};
        if (result.user1ID == decoded['user_id']) {
            if (result.user2Submit) {
                updatedData = {
                    user1Board: req.body.userPositions,
                    user1Submit: true,
                    user1Turn: true,
                    lastUpdate: new Date()
                }
            }
            else {
                updatedData = {
                    user1Board: req.body.userPositions,
                    user1Submit: true,
                    lastUpdate: new Date()
                }
            }
        }
        else if (result.user2ID == decoded['user_id']) {
            if (result.user1Submit) {
                updatedData = {
                    user2Board: req.body.userPositions,
                    user2Submit: true,
                    user1Turn: true,
                    lastUpdate: new Date()
                }
            }
            else {
                updatedData = {
                    user2Board: req.body.userPositions,
                    user2Submit: true,
                    lastUpdate: new Date()
                }
            }
        }
        GameBoards.updateOne({ "_id": ObjectId(result._id) }, { $set: updatedData }, function (err, result) {
            if (err !== null) {
                res.status(500).json(err);
            }
            else {
                res.status(200).json({ "gameID": result.gameID, "updatedAt": getTimeStamp(Date.now()) });
            }
        });
    }
    else {
        res.status(404).json({ "error": "Supplied Game ID Not Found" });
    }

});

module.exports = router;