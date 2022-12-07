const express = require('express');
const router = express.Router();
const { Users, GameBoards } = require('../db/model');
const config = process.env;
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');

// Create New Game
router.post('/', async (req, res) => {
    // Create Game ID

    const decoded = jwt.verify(req.cookies.token, config.JWT_KEY);

    // Assign Player1 and Player2
    let player1ID = req.body.uid;
    let player2ID = decoded['user_id'];
    // Make Sure Neither Player Is In Game
    const myGame = await Users.find({ _id: ObjectId(player2ID) }, { inGame: 1 });
    const theirGame = await Users.find({ _id: ObjectId(player1ID) }, { inGame: 1 });
    if (myGame[0].inGame) {
        res.status(500).json({ 'error': 'You Are Currently In A Game!' });
    }
    else if (theirGame[0].inGame) {
        res.status(500).json({ 'error': 'That User Is Currently In A Game!' });
    }
    else {
        // Update Player Status to "In Game"
        await Users.updateOne({ _id: ObjectId(player1ID) }, { $set: { inGame: true } });
        await Users.updateOne({ _id: ObjectId(player2ID) }, { $set: { inGame: true } });

        // Remove requesterID from user
        await Users.updateOne({ _id: ObjectId(player1ID) }, { $set: { requestedBy: null } });
        await Users.updateOne({ _id: ObjectId(player2ID) }, { $set: { requestedBy: null } });

        // Create New Game Board Since ID Not Exist
        const createdBoard = await GameBoards.create({
            user1ID: player1ID,
            user2ID: player2ID,
            user1Board: {
                'Battleship': '',
                'Carrier': '',
                'Cruiser': '',
                'Destroyer': '',
                'Submarine': ''
            },
            user1Plays: {
                'Zero': 'Zero'
            },
            user2Board: {
                'Battleship': '',
                'Carrier': '',
                'Cruiser': '',
                'Destroyer': '',
                'Submarine': ''
            },
            user2Plays: {
                'Zero': 'Zero'
            }
        });

        if (createdBoard._id != undefined) {
            // Write Header To Redirect To Game
            res.writeHead(302, { "Location": '/game' });
            return res.end();
        }
        else {
            res.status(500).json({ 'error': 'Game Object Not Created' });
        }


    }
});

module.exports = router;