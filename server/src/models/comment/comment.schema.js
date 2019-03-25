import Comment from "./comment.model";
import { AuthenticationError } from "apollo-server";

export const commentTypeDefs = `
    type Comment{
        id: ID!
        comment: String!
        date: String!
        userId: User!
        to: String!
        postId: String
        answerId: String
    }
    input CommentInput{
        comment: String
        userId: String
        to: String
        toId: String
    }
    extend type Mutation{
        createComment(data: CommentInput!): Comment 
    }
`;

export const commentResolver = {
  Mutation: {
    createComment: (_, { data }, { user }) => {
      if (!user) throw new AuthenticationError("You must be logged in");
      return Comment.create(data).then(data => {
        return Comment.populate(data, { path: "userId" });
      });
    }
  }
};
