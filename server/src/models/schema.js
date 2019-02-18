import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import { answerTypeDefs, answerResolver } from "./answer/answer.schema";
import { commentTypeDefs, commentResolver } from "./comment/comment.schema";
import { postTypeDefs, postResolver } from "./post/post.schema";
import { userTypeDefs, userResolver } from "./user/user.schema";
import { voteTypeDefs, voteResolver } from "./vote/vote.schema";

const rootTypeDefs = `
  type Query
  type Mutation
  schema {
    query: Query
    mutation: Mutation
  }
`;

const schema = makeExecutableSchema({
    typeDefs: [rootTypeDefs, answerTypeDefs, commentTypeDefs, postTypeDefs, userTypeDefs, voteTypeDefs],
    resolvers: merge(answerResolver, commentResolver, postResolver, userResolver, voteResolver)
});

export default schema;
