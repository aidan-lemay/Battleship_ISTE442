const express = require('express');
const router = express.Router();
const { NAME } = require('../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");

router.post('/', async (req, res) => {
    
});

module.exports = router;