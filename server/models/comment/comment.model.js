import Post from '../post/post.model';
import Answer from '../answer/answer.model';
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
        type: Date,
        required: true
    },
    to:{
        type: String,
        required: true
    },
    postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    answerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}
});

commentSchema.method('toGraph', function toGraph() {
    return JSON.parse(JSON.stringify(this));
});

commentSchema.virtual('toId').set(function(v){
    this[v.to+'Id'] = v.toId;
});

commentSchema.pre('save',function (next) {
    let now = Date.now();
    this.date = now;
    next();
});

commentSchema.post('save', function(doc){
    let obj = Answer, par = 'answerId';
    if(doc.to === 'post'){
        obj = Post;
        par = 'postId';
    }
    obj.findByIdAndUpdate(doc[par],{ $push: {comments: doc._id } }).then(out => out.toGraph(), error => error);
});

module.exports = mongoose.model('Comment', commentSchema);