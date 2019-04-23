import Answer from "./answer.model";
import Comment from "../comment/comment.model";
import {AuthenticationError} from "apollo-server";
import User from "../user/user.model";
import Vote from "../vote/vote.model";
import Post from "../post/post.model";

export const answerTypeDefs = `
    type Answer{
        id: ID!
        answer: String!
        createdDate: String!
        updatedDate: String!
        userId: User!
        comments(limit: Int): [Comment]
        commentsCount: Int!
        votes(userId: ID): [Vote]
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
        answers(id:ID!, paginationIndex: Int, limit: Int): [Answer]
        moreAnswers(postId: ID!, paginationIndex: Int!, limit: Int!): [Answer]
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
            return Comment.countDocuments({answerId: obj.id});
        },
        userId(obj) {
            return User.findById(obj.userId).catch(error => console.log("Error in retrieving userId:" + error));
        },
        comments(obj, {limit}) {
            limit = limit ? limit : 5;
            return Comment.find({answerId: obj.id}).sort({date: -1}).limit(limit).catch(error => console.log("Error in retrieving comments of answer data:" + error));
        },
        votes(obj, {userId}) {
            if (userId) {
                return Vote.find({
                    answerId: {$eq: obj.id},
                    userId: {$eq: userId}
                }).limit(1).catch(error => console.log("Error in retrieving votes of answer data:" + error))
            }
        },
        postId(obj) {
            return Post.findById(obj.postId).catch(error => console.log("Error in retrieving votes of answer data:" + error));
        }
    },
    Query: {
        postAnswersCount: (_, {postId}) => {
            return Answer.countDocuments({postId});
        },
        moreAnswers: async (
            _,
            {postId, paginationIndex, limit}
        ) => {
            paginationIndex = paginationIndex ? paginationIndex : 1;
            limit = limit ? limit : 10;
            return Answer.find({postId})
                .sort({voteValue: -1, createdDate: -1})
                .skip(paginationIndex >= 1 ? (paginationIndex - 1) * limit : 0)
                .limit(limit);
        },
        answers: async (
            _,
            {id, paginationIndex, limit}
        ) => {
            paginationIndex = paginationIndex ? paginationIndex : 1;
            limit = limit ? limit : 10;

            return Answer.find({userId: id})
                .sort({createdDate: -1})
                .skip(paginationIndex >= 1 ? (paginationIndex - 1) * limit : 0)
                .limit(limit);
        },
        userAnswersCount: (_, {id}) => {
            return Answer.countDocuments({userId: id});
        },
        checkUserHasAnswer: (_, {userId, postId}) => {
            if (userId && postId)
                return Answer.countDocuments({postId: postId, userId: userId}).then(
                    count => {
                        return count > 0;

                    }
                );
            return false;
        }
    },
    Mutation: {
        createAnswer: (_, {data}) => {
            return Answer.create(data).then(out => out, error => error);
            // new ApolloError("Error creating Answer object","INTERNAL_SERVER_ERROR");
        },
        updateAnswer: async (_, {email, answerId, answer}, {user}) => {
            user = await user;
            if (user.email === email)
                return Answer.findOneAndUpdate(
                    {_id: answerId},
                    {answer},
                    {new: true}
                );
            else
                throw new AuthenticationError(
                    "User don't have access to change this answer"
                );
        }
    }
};
