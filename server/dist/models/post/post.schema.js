'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.postResolver = exports.postTypeDefs = undefined;

var _post = require('./post.model');

var _post2 = _interopRequireDefault(_post);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var postTypeDefs = exports.postTypeDefs = '\n    type Post{\n        id: ID!\n        heading: String!\n        description: String\n        createdDate: String!\n        updatedDate: String!\n        views: Int\n        userId: String!\n        comments: [String]\n        answers: [String]\n    }\n    input PostInput{\n        heading: String\n        description: String\n        userId: String\n    }\n    extend type Mutation{\n        createPost(data: PostInput!): Post\n        incViews(id: String) : String\n    }\n';

var postResolver = exports.postResolver = {
    Mutation: {
        createPost: function createPost(_, _ref) {
            var data = _ref.data;

            return _post2.default.create(data).then(function (out) {
                return out;
            }, function (error) {
                return error;
            });
        },
        incViews: function incViews(_, _ref2) {
            var id = _ref2.id;

            return _post2.default.findByIdAndUpdate(id, { $inc: { views: 1 } }).then(function (out) {
                return out.views;
            }, function (error) {
                return error;
            });
        }
    }
};