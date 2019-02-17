const mongoose = require('mongoosee');

const voteSchema = mongoose.Schema({
    value : {
        type: Number,
        required: true,
        default: 0
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true
    },
    to:{
        type: String,
        required: true
    },
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    answer: {type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}
});


voteSchema.pre('save',function (next) {
    let now = Date.now();

    this.date = now;
    next();
});

module.exports = mongoose.model('Vote', voteSchema);