const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const boardSchema = new mongoose.Schema({
    user1ID: {
        required: true,
        type: ObjectId
    },
    user1Board: {
        required: true,
        type: Object
    },
    user1Submit: {
        required: false,
        type: Boolean,
        default: false
    },
    user1Turn: {
        required: false,
        type: Boolean,
        default: false
    },
    user1Plays: {
        required: false,
        type: Object
    },
    user1Hits: {
        required: false,
        type: Number,
        default: 0
    },
    user1Win: {
        required: false,
        type: Boolean,
        default: false
    },
    user2ID: {
        required: true,
        type: ObjectId
    },
    user2Board: {
        required: true,
        type: Object
    },
    user2Submit: {
        required: false,
        type: Boolean,
        default: false
    },
    user2Turn: {
        required: false,
        type: Boolean,
        default: false
    },
    user2Plays: {
        required: false,
        type: Object
    },
    user2Hits: {
        required: false,
        type: Number,
        default: 0
    },
    user2Win: {
        required: false,
        type: Boolean,
        default: false
    },
    winningID: {
        required: false,
        type: ObjectId
    },
    losingID: {
        required: false,
        type: ObjectId
    },
    lastUpdate: {
        required: false,
        type: Date
    },
    chatMessages: {
        fromUser: {
            required: false,
            type: ObjectId
        },
        text: {
            required: false,
            type: String
        },
        time: {
            required: false,
            type: Date
        }
    }
}, {collection: "gameBoards"});

const chatSchema = new mongoose.Schema({
    fromUser: {
        required: true,
        type: ObjectId
    },
    msg: {
        required: true,
        type: String
    },
    timeStamp: {
        required: true,
        type: Date
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
    },
    inGame: {
        required: false,
        type: Boolean,
        default: false
    },
    requestedBy: {
        required: false,
        type: ObjectId,
        default: null
    }
}, {collection: "userData"});

const GameBoards = mongoose.model('gameBoards', boardSchema);
const Chats = mongoose.model('chatData', chatSchema);
const Users = mongoose.model('userData', userSchema);

module.exports = {GameBoards, Chats, Users};
