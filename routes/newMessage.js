const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../db/model');

// Add Chat Message to DB
router.post('/', async (req, res) => {
    
});

module.exports = router;