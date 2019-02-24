'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlTools = require('graphql-tools');

var _lodash = require('lodash');

var _answer = require('./answer/answer.schema');

var _comment = require('./comment/comment.schema');

var _post = require('./post/post.schema');

var _user = require('./user/user.schema');

var _vote = require('./vote/vote.schema');

var rootTypeDefs = '\n  type Query\n  type Mutation\n  schema {\n    query: Query\n    mutation: Mutation\n  }\n';

var schema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: [rootTypeDefs, _user.userTypeDefs, _post.postTypeDefs, _answer.answerTypeDefs, _comment.commentTypeDefs, _vote.voteTypeDefs],
  resolvers: (0, _lodash.merge)(_answer.answerResolver, _comment.commentResolver, _post.postResolver, _user.userResolver, _vote.voteResolver)
});

exports.default = schema;