'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.answerResolver = exports.answerTypeDefs = undefined;

var _answer = require('./answer.model');

var _answer2 = _interopRequireDefault(_answer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var answerTypeDefs = exports.answerTypeDefs = '\n    type Answer{\n        id: ID!\n        answer: String!\n        createdDate: String!\n        updatedDate: String!\n        userId: String!\n        comments: [Comment]\n        votes: [Vote]\n        voteValue: Int!\n        postId: String!\n    }\n    input AnswerInput{\n        answer: String\n        userID: String\n        postId: String\n    }\n    input AnswerUpdate{\n        answer: String\n        id: String\n    }\n    extend type Mutation{\n        createAnswer(data: AnswerInput!): Answer\n        updateAnswer(data: AnswerUpdate!): Answer\n    }\n';

var answerResolver = exports.answerResolver = {
    Mutation: {
        createAnswer: function createAnswer(_, _ref) {
            var data = _ref.data;

            return _answer2.default.create(data).then(function (out) {
                return out;
            }, function (error) {
                return error;
            });
            // new ApolloError("Error creating Answer object","INTERNAL_SERVER_ERROR");
        },
        updateAnswer: function updateAnswer(_, _ref2) {
            var data = _ref2.data;

            return _answer2.default.findByIdAndUpdate(data.id, { $set: { answer: data.answer } }).then(function (out) {
                return out;
            }, function (error) {
                return error;
            });
        }
    }
};