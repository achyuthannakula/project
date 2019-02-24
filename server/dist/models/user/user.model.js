'use strict';

var mongoose = require('mongoose');
var validator = require('validator');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function validate(value) {
            return validator.isEmail(value);
        }
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    via: String,
    profilePicture: String,
    views: Number /*,
                  posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
                  answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}]*/
});

userSchema.method('toGraph', function toGraph() {
    return JSON.parse(JSON.stringify(this));
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

userSchema.virtual('answers', {
    ref: 'Answer',
    localField: '_id',
    foreignField: 'userId'
});

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'userId'
});

module.exports = mongoose.model('User', userSchema);
//exports default mongoose.model('User', userSchema);