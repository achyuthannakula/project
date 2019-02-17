import Answer from "../answer/answer.model";
import Post from "../post/post.model";
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
    postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    answerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

voteSchema.method('toGraph', function toGraph() {
    return JSON.parse(JSON.stringify(this));
});

voteSchema.virtual('toId').set(function(v){
    this[v.to+'Id'] = v.toId;
});

voteSchema.virtual('amount').set();

voteSchema.post('save', function(doc){
    let obj = Answer, par = 'answerId';
    if(doc.to === 'post'){
        obj = Post;
        par = 'postId';
    }
    obj.findByIdAndUpdate(doc[par],{ $push: {votes: doc._id }, $inc: {voteValue: doc.value} }).then(out => out.toGraph(), error => error);
});

voteSchema.post('update', function(doc){
    let obj = Answer, par = 'answerId';
    if(doc.to === 'post'){
        obj = Post;
        par = 'postId';
    }
    obj.findByIdAndUpdate(doc[par],{ $inc: {voteValue: doc.amount} }).then(out => out.toGraph(), error => error);
});

voteSchema.pre('save',function (next) {
    let now = Date.now();

    this.date = now;
    next();
});

module.exports = mongoose.model('Vote', voteSchema);