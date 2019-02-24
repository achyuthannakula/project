'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.userResolver = exports.userTypeDefs = undefined;

var _user = require('./user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userTypeDefs = exports.userTypeDefs = '\n    type User{\n        id: ID!\n        name: String!\n        username: String!\n        email: String!\n        email_verified: Boolean\n        profilePicture: String\n        views: Int\n        via: String\n        posts:[Post]\n        answers:[Answer] \n    }\n    input UserInput{\n        name: String!\n        username: String!\n        email: String!\n        email_verified: Boolean\n        profilePicture: String\n        via: String\n    }\n    extend type Query{\n        user(id: String): User\n    }\n    extend type Mutation{\n        createUser(data: UserInput!): User\n    }\n';
var userResolver = exports.userResolver = {
    Query: {
        user: function user(_, _ref, context) {
            var id = _ref.id;

            return _user2.default.findById(id).populate('posts').populate('answers').then(function (data) {
                console.log(context);return data;
            });
        }
    },
    Mutation: {
        createUser: function createUser(_, _ref2) {
            var data = _ref2.data;

            return _user2.default.create(data).then(function (doc) {
                return doc;
            }, function (err) {
                return err;
            });
        }
    }
};