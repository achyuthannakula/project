'use strict';

var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    answerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

commentSchema.set('toObject', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });

commentSchema.method('toGraph', function toGraph() {
    return JSON.parse(JSON.stringify(this));
});

commentSchema.virtual('toId').set(function (v) {
    this[v.to + 'Id'] = v.toId;
});

commentSchema.pre('save', function (next) {
    var now = Date.now();
    this.date = now;
    next();
});

module.exports = mongoose.model('Comment', commentSchema);