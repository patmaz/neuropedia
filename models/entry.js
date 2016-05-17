var mongoose = require('mongoose');

module.exports = mongoose.model('entries', {
    title: String,
    body: String,
    date: {
        type: Date,
        default: Date.now
    }
});
