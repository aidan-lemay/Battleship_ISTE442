const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const boardSchema = new mongoose.Schema({
    user1ID: {
        required: true,
        type: ObjectId
    },
    user1Ships: {
        required: true,
        type: String
    },
    user2ID: {
        required: true,
        type: ObjectId
    },
    user2Ships: {
        required: true,
        type: String
    },
    chatMessages: {
        fromUser: {
            required: false,
            type: Number
        },
        text: {
            required: false,
            type: String
        },
        time: {
            required: false,
            type: Date
        }
    },
    timeStamp: {
        required: true,
        type: Date
    }
}, {collection: "gameBoards"});

const chatSchema = new mongoose.Schema({
    id: {
        required: true,
        type: Number
    },
    fromUser: {
        required: true,
        type: Number
    },
    timeStamp: {
        required: true,
        type: Number
    }
}, {collection: "chatData"});

const userSchema = new mongoose.Schema({
    fName: {
        required: true,
        type: String
    },
    lName: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    token: {
        required: false,
        type: String
    },
    hPass: {
        required: true,
        type: String
    }
}, {collection: "userData"});

const GameBoards = mongoose.model('gameBoards', boardSchema);
const Chats = mongoose.model('chatData', chatSchema);
const Users = mongoose.model('userData', userSchema);

module.exports = {GameBoards, Chats, Users};
