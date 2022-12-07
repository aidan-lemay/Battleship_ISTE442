require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
let bodyParser = require('body-parser');
const CookieParser = require('cookie-parser');

// Allow CORS Headers
const cors = require('cors');
app.use(cors({
    origin: '*'
}));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Serve /public to browser
app.use(express.static('public'))

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(CookieParser());

// DB Scripts
mongoose.connect(mongoString);
const db = mongoose.connection;
db.on('error', (error) => {
    console.log(error)
})

db.once('connected', () => {
    console.log('Database Connected');
})

// Chat Server
const chatServer = require('./chat-server');

// Authenticational
const auth = require('./routes/auth/auth');

// Pages
const defaultRoute = require('./routes/default');

const signIn = require('./routes/auth/signIn');
const signUp = require('./routes/auth/signUp');
const signOut = require('./routes/auth/signOut');

const chat = require('./routes/chat');
const game = require('./routes/game');

// Logic
const message = require('./routes/message');
const getFreeUsers = require('./routes/getFreeUsers');
const getMyStatus = require('./routes/getMyStatus');
const requestGame = require('./routes/requestGame');
const startGame = require('./routes/startGame');
const submitBoard = require('./routes/submitBoard');
const getGameDetails = require('./routes/getGameDetails');
const submitTurn = require('./routes/submitTurn');
const highestID = require('./routes/highestID');
const checkTurn = require('./routes/checkTurn');
const leaveGame = require('./routes/leaveGame');

// Route Methods
app.use('/', defaultRoute);

// Page Endpoints
app.use('/signIn', signIn);
app.use('/signUp', signUp);
app.use('/signOut', auth, signOut);

app.use('/chat', auth, chat);
app.use('/game', auth, game);

// Logical Endpoints
app.use('/message', auth, message);
app.use('/getFreeUsers', auth, getFreeUsers);
app.use('/getMyStatus', auth, getMyStatus);
app.use('/requestGame', auth, requestGame);
app.use('/startGame', auth, startGame);
app.use('/submitBoard', auth, submitBoard);
app.use('/getGameDetails', auth, getGameDetails);
app.use('/submitTurn', auth, submitTurn);
app.use('/highestID', auth, highestID);
app.use('/checkTurn', auth, checkTurn);
app.use('/leaveGame', auth, leaveGame);

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})
