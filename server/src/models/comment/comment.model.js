const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    comment:{
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date:{
        type: Date
    },
    to:{
        type: String,
        required: true
    },
    postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    answerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

commentSchema.set('toObject', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });

commentSchema.method('toGraph', function toGraph() {
    return JSON.parse(JSON.stringify(this));
});

commentSchema.virtual('toId').set(function(v){
    if(this.to === 'post')
        this.postId = v;
    else
        this.answerId = v;
});

commentSchema.pre('save',function (next) {
    let now = Date.now();
    this.date = now;
    next();
});

module.exports = mongoose.model('Comment', commentSchema);