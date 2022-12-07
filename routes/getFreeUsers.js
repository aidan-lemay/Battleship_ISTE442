const express = require('express');
const router = express.Router();
const { Users } = require('../db/model');
const jwt = require("jsonwebtoken");
const config = process.env;

router.get('/', async (req, res) => {
    const decoded = jwt.verify(req.cookies.token, config.JWT_KEY);
    const result = await Users.find({inGame: false, _id: {$ne: decoded['user_id']}}, {fName: 1, lName: 1, _id: 1});
    res.status(200).json(result);
});

module.exports = router;