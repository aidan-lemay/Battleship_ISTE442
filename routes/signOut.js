const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../db/model');

// GET Login for rendering HTML page in DOM
router.get('/', async (req, res) => {
    res.writeHead(301, { "set-cookie": "token=", "Location": '/signIn' });
});

module.exports = router;