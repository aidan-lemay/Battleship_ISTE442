require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
let bodyParser = require('body-parser');

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB Scripts
mongoose.connect(mongoString);
const db = mongoose.connection;
db.on('error', (error) => {
    console.log(error)
})

db.once('connected', () => {
    console.log('Database Connected');
})

// Route Definitions
const auth = require('./routes/auth/auth');
const signIn = require('./routes/auth/signIn');
const signUp = require('./routes/auth/signUp');
const submitBoard = require('./routes/submitBoard');
const highestID = require('./routes/highestID');

// Methods
app.use('/signIn', signIn);
app.use('/signUp', signUp);
app.use('/submitBoard', auth, submitBoard);
app.use('/highestID', auth, highestID);

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})