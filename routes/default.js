const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../db/model');

router.get('/', async (req, res) => {
    res.writeHead(302, { "Location": '/signIn' });
    return res.end();
});

module.exports = router;