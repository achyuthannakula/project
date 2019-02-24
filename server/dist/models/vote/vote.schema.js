'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.voteResolver = exports.voteTypeDefs = undefined;

var _vote = require('./vote.model');

var _vote2 = _interopRequireDefault(_vote);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var voteTypeDefs = exports.voteTypeDefs = '\n    type Vote{\n        id: ID!\n        value: String!\n        date: String!\n        userId: String!\n        to: String!\n        postId: String\n        answerId: String\n    }\n    input VoteInput{\n        value: String\n        userId: String\n        to: String\n        toId: ToId\n    }\n    extend type Mutation{\n        createVote(data: VoteInput!): Vote\n    }\n';

var voteResolver = exports.voteResolver = {
    Mutation: {
        createVote: function createVote(_, _ref) {
            var data = _ref.data;

            return _vote2.default.create(data).then(function (out) {
                return out;
            }, function (error) {
                return error;
            });
        }
    }
};