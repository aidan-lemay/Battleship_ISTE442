const express = require('express');
const router = express.Router();
const { GameBoards } = require('../db/model');
const config = process.env;
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');

// Create New Game
router.put('/', async (req, res) => {
    // Make sure it's the supplying users turn
    let myTurn = false;
    let turn = '';
    let userPlays = [];
    let hits = 0;
    // Make sure the selection hasn't been done before
    // Make sure there is an actual selection

    if (req.body.selectedTile == undefined) {
        return res.status().json({ 'error': 'No Tile Sent' });
    }
    else {

        const decoded = jwt.verify(req.cookies.token, config.JWT_KEY);
        const result = await GameBoards.findOne({ $or: [{ user1ID: decoded['user_id'] }, { user2ID: decoded['user_id'] }] });

        let tile = req.body.selectedTile;
        tile = tile.slice(5);
        let gameID = result._id;
        let otherShips = {};

        if (result.user1ID == decoded['user_id']) {
            if (result.user1Turn) {
                myTurn = true;
                turn = 1;
                otherShips = result.user2Board;
                hits = result.user1Hits;
                userPlays = await GameBoards.findOne({ _id: ObjectId(gameID) }, { user1Plays: 1, _id: 0 });
                userPlays = JSON.parse(JSON.stringify(userPlays['user1Plays']));
            }
        }
        else if (result.user2ID == decoded['user_id']) {
            if (result.user2Turn) {
                myTurn = true;
                turn = 2;
                otherShips = result.user1Board;
                hits = result.user2Hits;
                userPlays = await GameBoards.findOne({ _id: ObjectId(gameID) }, { user2Plays: 1, _id: 0 });
                userPlays = JSON.parse(JSON.stringify(userPlays['user2Plays']));
            }
        }

        if (myTurn) {
            let hit = {};
            if (otherShips['Battleship'] == tile) {
                hit = { "Battleship": tile };
            }
            else if (otherShips['Carrier'] == tile) {
                hit = { "Carrier": tile };
            }
            else if (otherShips['Cruiser'] == tile) {
                hit = { "Cruiser": tile };
            }
            else if (otherShips['Destroyer'] == tile) {
                hit = { "Destroyer": tile };
            }
            else if (otherShips['Submarine'] == tile) {
                hit = { "Submarine": tile };
            }
            else {
                hit = false;
            }

            if (!hit) {
                userPlays[tile] = false;
                if (turn == 1) {
                    
                    GameBoards.updateOne({ "_id": ObjectId(result._id) }, {$set: {user1Plays: userPlays, user1Turn: false, user2Turn: true, lastUpdate: new Date()}}, function (err, result) {
                        if (err !== null) {
                            res.status(500).json({ 'error': err });
                        }
                        else {
                            res.status(200).json({ 'miss': tile });
                        }
                    });
                }
                else if (turn == 2) {
                    GameBoards.updateOne({ "_id": ObjectId(result._id) }, {$set: {user2Plays: userPlays, user2Turn: false, user1Turn: true, lastUpdate: new Date()}}, function (err, result) {
                        if (err !== null) {
                            res.status(500).json({ 'error': err });
                        }
                        else {
                            res.status(200).json({ 'miss': tile });
                        }
                    });
                }

            }
            else {
                userPlays[tile] = true;
                hits ++;
                
                if (turn == 1) {
                    if (hits == 5) {
                        GameBoards.updateOne({ "_id": ObjectId(result._id) }, {$set: {user1Win: true, user2Win: false, user1Turn: false, user2Turn: false, lastUpdate: new Date()}}, function (err, result) {
                            if (err !== null) {
                                res.status(500).json({ 'error': err });
                            }
                            else {
                                res.status(200).json({tile: true, 'win': decoded['user_id']});
                            }
                        });
                    }
                    else {
                        GameBoards.updateOne({ "_id": ObjectId(result._id) }, {$set: {user1Plays: userPlays, user1Hits: hits, user1Turn: false, user2Turn: true, lastUpdate: new Date()}}, function (err, result) {
                            if (err !== null) {
                                res.status(500).json({ 'error': err });
                            }
                            else {
                                res.status(200).json(hit);
                            }
                        });
                    }
                    
                }
                else if (turn == 2) {
                    if (hits == 5) {
                        GameBoards.updateOne({ "_id": ObjectId(result._id) }, {$set: {user2Win: true, user1Win: false, user1Turn: false, user2Turn: false, lastUpdate: new Date()}}, function (err, result) {
                            if (err !== null) {
                                res.status(500).json({ 'error': err });
                            }
                            else {
                                res.status(200).json({tile: true, 'win': decoded['user_id']});
                            }
                        });
                    }
                    else {
                        GameBoards.updateOne({ "_id": ObjectId(result._id) }, {$set: {user2Plays: userPlays, user2Hits: hits, user2Turn: false, user1Turn: true, lastUpdate: new Date()}}, function (err, result) {
                            if (err !== null) {
                                res.status(500).json({ 'error': err });
                            }
                            else {
                                res.status(200).json(hit);
                            }
                        });
                    }
                    
                }
            }
        }
        else {
            res.status(200).json({ 'turn': false });
        }

    }
});

module.exports = router;