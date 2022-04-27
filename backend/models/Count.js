const mongoose = require('mongoose');

const countSchema = mongoose.Schema({
    name: {
        type: String
    },
    totalCount: {
        type: Number
    }
})

const Count = mongoose.model('Count', countSchema);

module.exports = {Count}