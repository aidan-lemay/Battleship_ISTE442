const express = require('express');
const router = express.Router();
const { GameBoards, Users } = require('../db/model');
const { ObjectId } = require('mongodb');
const config = process.env;
const jwt = require("jsonwebtoken");

// GET Login for rendering HTML page in DOM
router.get('/', async (req, res) => {
    console.log('leave');
    let winID = "";
    const decoded = jwt.verify(req.cookies.token, config.JWT_KEY);
    
    const result = await GameBoards.findOne({ $or: [{ user1ID: decoded['user_id'] }, { user2ID: decoded['user_id'] }] });

    if (result != null) {
        await Users.updateOne({ _id: ObjectId(result.user1ID) }, { $set: { inGame: false } });
        await Users.updateOne({ _id: ObjectId(result.user2ID) }, { $set: { inGame: false } });

        if (result.user1Win) {
            winID = result.user1ID;
        }
        else if (result.user2Win) {
            winID = result.user2ID;
        }

        await GameBoards.updateOne({ _id: ObjectId(result._id) }, { $set: { user1ID: null, user2ID: null, winningID: ObjectId(winID) } });

        res.writeHead(302, { "Location": '/chat' });
        return res.end();
    }
    else {
        res.writeHead(302, { "Location": '/chat' });
        return res.end();
    }
    
});

module.exports = router;