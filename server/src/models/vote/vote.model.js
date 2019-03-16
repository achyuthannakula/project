const mongoose = require('mongoose');

const voteSchema = mongoose.Schema({
    value : {
        type: Number,
        required: true,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date
    },
    to:{
        type: String,
        required: true
    },
    postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    answerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

voteSchema.set('toObject', { virtuals: true });
voteSchema.set('toJSON', { virtuals: true });

voteSchema.method('toGraph', function toGraph() {
    return JSON.parse(JSON.stringify(this));
});

voteSchema.virtual('toId').set(function(v){
    if(this.to === 'post')
        this.postId = v;
    else
        this.answerId = v;
});

voteSchema.pre('save',function (next) {
    let now = Date.now();

    this.date = now;
    next();
});

module.exports = mongoose.model('Vote', voteSchema);