const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    spectatedArray: [{
        userid: {
            type: Number,
            required: true
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        online_data: [{
            time: {
                type: Number,
                required: true
            },
            is_online: {
                type: Number,
                required: true
            }
        }]
    }]
});

module.exports = User = mongoose.model('user', UserSchema);