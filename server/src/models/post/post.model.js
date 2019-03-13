const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    heading: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    views: {
        type: Number,
        default: 0
    },
    createdDate: {
        type: Date
    },
    updatedDate: {
        type: Date
    },
/*    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],*/
/*    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    }],*/
    userId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
/*    votes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote'
    }],*/
    voteValue:{
        type: Number
    }
},{ toJSON: { virtuals: true }, toObject: { virtuals: true } });

postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });

//Virtual Populate
postSchema.virtual('votes', {
    ref: 'Vote',
    localField: '_id',
    foreignField: 'postId'
});

postSchema.virtual('id').get(function() {
    return toString(this._id);
})

postSchema.virtual('answers', {
    ref: 'Answer',
    localField: '_id',
    foreignField: 'postId'
});

postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'postId'
});

postSchema.pre('save',function (next) {
    let now = Date.now();

    this.updatedDate = now;
    if (!this.createdDate) {
        this.createdDate = now;
    }
    next();
});


module.exports = mongoose.model('Post', postSchema);