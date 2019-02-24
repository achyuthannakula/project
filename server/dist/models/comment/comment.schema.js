'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.commentResolver = exports.commentTypeDefs = undefined;

var _comment = require('./comment.model');

var _comment2 = _interopRequireDefault(_comment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commentTypeDefs = exports.commentTypeDefs = '\n    type Comment{\n        id: ID!\n        comment: String!\n        date: String!\n        userId: String!\n        to: String!\n        postId: String\n        answerId: String\n    }\n    input ToId{\n        to: String,\n        toId: String\n    }\n    input CommentInput{\n        comment: String\n        userId: String\n        to: String\n        toId: ToId\n    }\n    extend type Mutation{\n        createComment(data: CommentInput!): Comment \n    }\n';

var commentResolver = exports.commentResolver = {
    Mutation: {
        createComment: function createComment(_, _ref) {
            var data = _ref.data;

            return _comment2.default.create(data).then(function (out) {
                return out;
            }, function (error) {
                return error;
            });
        }
    }
};