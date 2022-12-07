const express = require('express');
const router = express.Router();
const { Users } = require('../db/model');
const config = process.env;
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');

// Get user by my ID and see if they have an active requester, if so get name and prompt for allow
router.get('/', async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, config.JWT_KEY);
    const myGame = await Users.find({_id: ObjectId(decoded['user_id'])}, {requestedBy: 1, _id: 0});
    if (myGame[0]['requestedBy'] != undefined) {
        const requester = await Users.find({_id: ObjectId(myGame[0]['requestedBy'])}, {fName: 1, lName: 1, _id: 1});
        res.status(200).json(requester);
    }
    else {
        res.status(202).json({'request': false});
    }
});

// Add requester flag to specified user
router.put('/', async (req, res) => {
    // Check to see if requesting user is in a game first
    const decoded = jwt.verify(req.cookies.token, config.JWT_KEY);
    const myGame = await Users.find({_id: ObjectId(decoded['user_id'])}, {inGame: 1});
    const theirGame = await Users.find({_id: ObjectId(req.body.uid)}, {inGame: 1});

    if (myGame[0]['inGame']) {
        res.status(500).json({'error': 'You Are Currently In A Game!'});
    }
    else if (theirGame[0]['inGame']) {
        res.status(500).json({'error': 'That User Is Currently In A Game!'});
    }
    else {
        // Set requested user requestedBy flag to current user ID
        await Users.updateOne({_id: req.body.uid}, {$set: {requestedBy: ObjectId(decoded["user_id"])}});
        res.status(202).json({'success': 'User Request Processed'});
    }
    
});

// Remove requester flag from specified user
router.put('/decline', async (req, res) => {
    // Check to see if requesting user is in a game first
    const decoded = jwt.verify(req.cookies.token, config.JWT_KEY);

    // Set requested user requestedBy flag to null
    await Users.updateOne({_id: decoded['user_id']}, {$set: {requestedBy: null}});
    res.status(202).json({'success': 'User Decline Processed'});
    
});
// Note - Accepted games will be handled by /startGame

module.exports = router;