const mongoose = require('mongoose');

const NAME = new mongoose.Schema({
    NAME: {
        required: true,
        type: String
    }
}, {collection: 'NAME'})

const NAME = mongoose.model('name', NAME)

module.exports = {NAME}