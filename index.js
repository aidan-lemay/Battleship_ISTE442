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

// Authenticational
const auth = require('./routes/auth/auth');

// Pages
const defaultRoute = require('./routes/default');

const signIn = require('./routes/auth/signIn');
const signUp = require('./routes/auth/signUp');

const chat = require('./routes/chat');
const game = require('./routes/game');

const signOut = require('./routes/signOut');
const newMessage = require('./routes/newMessage');
const submitBoard = require('./routes/submitBoard');
const highestID = require('./routes/highestID');

// Route Methods
app.use('/', defaultRoute);

// Page Endpoints
app.use('/signIn', signIn);
app.use('/signUp', signUp);
app.use('/signOut', auth, signOut);

app.use('/chat', auth, chat);
app.use('/game', auth, game);

// Logical Endpoints
app.use('/newMessage', auth, newMessage);
app.use('/submitBoard', auth, submitBoard);
app.use('/highestID', auth, highestID);

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})