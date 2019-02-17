import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import { userTypeDefs, userResolver } from "./user/user.schema";
import { answerTypeDefs, answerResolver } from "./answer/answer.schema";

const rootTypeDefs = `
  type Query
  type Mutation
  schema {
    query: Query
    mutation: Mutation
  }
`;

const schema = makeExecutableSchema({
    typeDefs: [rootTypeDefs, userTypeDefs, answerTypeDefs],
    resolvers: merge(userResolver, answerResolver)
});

export default schema;
