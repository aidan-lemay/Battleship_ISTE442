const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../db/model');
const config = process.env;
const { ObjectId } = require('mongodb');

// Add Chat Message to DB
router.get('/', async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, config.JWT_KEY);
    const myGame = await Users.find({_id: ObjectId(decoded['user_id'])}, {inGame: 1});

    res.status(200).json({'game': myGame[0].inGame});
});

module.exports = router;