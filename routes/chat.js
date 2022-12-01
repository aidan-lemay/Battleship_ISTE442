const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../db/model');

// GET Chat File for rendering HTML page in DOM
router.get('/', async (req, res) => {
    res.sendFile(__dirname + "/pageAssets/chat.html");
});

module.exports = router;