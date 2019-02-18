const mongoose = require('mongoose');
const answerSchema = mongoose.Schema({
    answer:{
        type: String,
        required: true
    },
    createdDate:{
        type: Date,
        required: true
    },
    updatedDate: {
        type: Date,
        required: true
    },
    userId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
/*    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],*/
/*    votes:[{
        type: mongoose.Schema.Types.objectId,
        ref: 'Vote'
    }],*/
    voteValue:{
        type: Number,
        default: 0
    },
    postId:{
        type:  mongoose.Schema.Types.objectId,
        ref: 'Post'
    }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

answerSchema.method('toGraph', function toGraph() {
    return JSON.parse(JSON.stringify(this));
});

answerSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'answerId'
});

answerSchema.virtual('votes', {
    ref: 'Vote',
    localField: '_id',
    foreignField: 'answerId'
});

answerSchema.pre('save',function (next) {
    let now = Date.now();
    console.log("inside post-pre saveeee");

    this.updatedDate = now;
    if (!this.createdDate) {
        this.createdDate = now;
    }
    next();
});

module.exports = mongoose.model('Answer', answerSchema);