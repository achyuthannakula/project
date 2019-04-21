import Answer from "./answer.model";
import Comment from "../comment/comment.model";
import { AuthenticationError } from "apollo-server";

export const answerTypeDefs = `
    type Answer{
        id: ID!
        answer: String!
        createdDate: String!
        updatedDate: String!
        userId: User!
        comments: [Comment]
        commentsCount: Int!
        votes: [Vote]
        voteValue: Int!
        postId: Post
    }
    input AnswerInput{
        answer: String
        userId: String
        postId: String
    }
    input AnswerUpdate{
        answer: String
        id: String
    }
    extend type Query{
      answers(id:ID!, userId: ID, paginationIndex: Int, noPostsInPage: Int): [Answer]
      moreAnswers(postId: ID!, userId: ID, paginationIndex: Int!, noPostsInPage: Int!): [Answer]
      userAnswersCount(id: ID!): Int!
      postAnswersCount(postId: ID!):Int!
      checkUserHasAnswer(userId: ID!, postId: ID!) : Boolean
    }
    extend type Mutation{
        createAnswer(data: AnswerInput!): Answer
        updateAnswer(email: String!, answerId: ID!, answer: String!): Answer
    }
`;

export const answerResolver = {
  Answer: {
    commentsCount(obj) {
      return Comment.countDocuments({ answerId: obj.id });
    }
  },
  Query: {
    postAnswersCount: (_, { postId }) => {
      return Answer.countDocuments({ postId });
    },
    moreAnswers: async (
      _,
      { postId, userId, paginationIndex, noPostsInPage },
      { user }
    ) => {
      paginationIndex = paginationIndex ? paginationIndex : 1;
      noPostsInPage = noPostsInPage ? noPostsInPage : 10;
      //user = await user;
      const votePopulate = [{ path: "userId" }];
      if (userId)
        votePopulate.push({
          path: "votes",
          match: {
            userId: { $eq: userId }
          },
          options: { limit: 1 }
        });
      return Answer.find({ postId })
        .populate([...votePopulate])
        .populate({
          path: "comments",
          options: {
            limit: 5,
            sort: { date: -1 }
          },
          populate: {
            path: "userId"
          }
        })
        .sort({ voteValue: -1, createdDate: -1 })
        .skip(paginationIndex >= 1 ? (paginationIndex - 1) * noPostsInPage : 0)
        .limit(noPostsInPage);
    },
    answers: async (
      _,
      { id, userId, paginationIndex, noPostsInPage },
      { user }
    ) => {
      paginationIndex = paginationIndex ? paginationIndex : 1;
      noPostsInPage = noPostsInPage ? noPostsInPage : 10;
      //user = await user;

      const votePopulate = [{ path: "userId" }];
      if (userId)
        votePopulate.push({
          path: "votes",
          match: {
            userId: { $eq: userId }
          },
          options: { limit: 1 }
        });
      return Answer.find({ userId: id })
        .populate([...votePopulate])
        .populate("postId")
        .sort({ createdDate: -1 })
        .skip(paginationIndex >= 1 ? (paginationIndex - 1) * noPostsInPage : 0)
        .limit(noPostsInPage);
    },
    userAnswersCount: (_, { id }) => {
      return Answer.countDocuments({ userId: id });
    },
    checkUserHasAnswer: (_, { userId, postId }) => {
      if (userId && postId)
        return Answer.countDocuments({ postId: postId, userId: userId }).then(
          count => {
            if (count > 0) return true;
            return false;
          }
        );
      return false;
    }
  },
  Mutation: {
    createAnswer: (_, { data }) => {
      return Answer.create(data).then(out => out, error => error);
      // new ApolloError("Error creating Answer object","INTERNAL_SERVER_ERROR");
    },
    updateAnswer: async (_, { email, answerId, answer }, { user }) => {
      user = await user;
      if (user.email === email)
        return Answer.findOneAndUpdate(
          { _id: answerId },
          { answer },
          { new: true }
        );
      else
        throw new AuthenticationError(
          "User don't have access to change this answer"
        );
    }
  }
};
