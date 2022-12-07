const express = require('express');
const router = express.Router();
const { GameBoards } = require('../db/model');
const config = process.env;
const jwt = require("jsonwebtoken");

router.get('/', async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, config.JWT_KEY);
    const result = await GameBoards.findOne({ $or: [ { user1ID: decoded['user_id'] }, { user2ID: decoded['user_id'] } ] });
    
    // Result is null if user is no longer in game
    if (result != null) {
        let myID = "";
        let myTurn = "";

        if (result.user1ID == decoded['user_id']) {
            myID = result.user1ID;
            myTurn = result.user1Turn;
        }
        else if (result.user2ID == decoded['user_id']) {
            myID = result.user2ID;
            myTurn = result.user2Turn;
        }

        if (result._id == undefined) {
            res.status(200).json({"inGame": false});
        }
        else {
            let resData = {
                "inGame": true,
                "gameID": result._id,
                "myID": myID,
                "myTurn": myTurn
            }
            res.status(200).json(resData);
        }
    }
    
    
});

module.exports = router;