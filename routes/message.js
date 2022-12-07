const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Chats } = require('../db/model');
const { ObjectId } = require('mongodb');

// Get All Chat Messages From DB
router.get('/', async (req, res) => {

});

// Add Chat Message to DB
router.post('/', async (req, res) => {
    console.log('post');
    let chatData = req.body.chatMessage;
    console.log(chatData);
    if (chatData != undefined) {
        if (chatData.fromUser == null || chatData.msg == null || chatData.timeStamp == null) {
            res.status(400).json({'error': 'Missing Data'});
        }
        else {
            const message = await Chats.create({
                fromUser: ObjectId(chatData.fromUser),
                msg: chatData.msg,
                timeStamp: chatData.timeStamp
            });
            res.status(200).json(message);
        }
    }
    else {
        res.status(500);
    }
    
});

module.exports = router;