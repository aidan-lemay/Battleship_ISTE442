const express = require('express');
const router = express.Router();
const { GameBoards } = require('../db/model');

router.get('/', async (req, res) => {
    const result = await GameBoards.find({}, {gameID: 1}).sort({gameID: -1}).limit(1);
    res.status(200).json({"highestID": result[0].gameID});
});

module.exports = router;