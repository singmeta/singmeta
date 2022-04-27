const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    id: {
        type: Number
    },
    themeNum: {
        type: String
    },
    roomName: {
        type: String
    },
    headCount: {
        type: Number
    },
    pw_YN: {
        type: String
    },
    pw: {
        type: String
    },
    reg_date:{
        type: String
    }
})

const Room = mongoose.model('Room', roomSchema);

module.exports = {Room}