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

// const auth = require('./auth');
const submitBoard = require('./routes/submitBoard');
const highestID = require('./routes/highestID');

// Methods
// app.use('/submitBoard', auth, submitBoard);
app.use('/submitBoard', submitBoard);
app.use('/highestID', highestID);

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})