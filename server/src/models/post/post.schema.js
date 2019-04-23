import Post from "./post.model";
import Comment from "../comment/comment.model";
import Answer from "../answer/answer.model";
import Vote from "../vote/vote.model";

import {AuthenticationError} from "apollo-server";
import User from "../user/user.model";

export const postTypeDefs = `
    type Post{
        id: ID!
        heading: String!
        description: String
        createdDate: String!
        updatedDate: String!
        views: Int
        userId: User!
        comments(limit: Int): [Comment]
        commentsCount: Int!
        answers(answerId: ID, limit: Int): [Answer]
        voteValue: Int
        votes(userId: ID):[Vote]
    }
    extend type Query{
        postCount: Int
        userPostsCount(id: ID!): Int!
        postsById(id: ID!, paginationIndex: Int, limit: Int): [Post]
        posts( sort: String!, paginationIndex: Int, limit: Int, cursorDate: String) : [Post]
        post(postId :ID!) : Post
    }
    input PostInput{
        heading: String
        description: String
        userId:String!
    }
    extend type Mutation{
        createPost(data: PostInput!): Post
        updatePost(email: String!, postId: ID!, question: String!, description: String) : Post
        incViews(id: String) : String
    }
`;

export const postResolver = {
    Post: {
        commentsCount(obj) {
            return Comment.countDocuments({postId: obj.id});
        },
        userId(obj) {
            return User.findById(obj.userId).catch(error => console.log("Error in retrieving userId:" + error));
        },
        comments(obj, {limit}) {
            limit = limit ? limit : 5;
            return Comment.find({postId: obj.id}).sort({date: -1}).limit(limit).catch(error => console.log("Error in retrieving comments of post data:" + error));
        },
        answers(obj, {answerId, limit}) {
            console.log("here-in answer of post");
            limit = limit ? limit : 5;
            if (answerId)
                return Answer.find({
                    _id: answerId,
                    postId: obj.id
                }).catch(error => console.log("Error in retrieving specific answer of post data:" + error));
            return Answer.find({postId: obj.id}).sort({
                voteValue: -1,
                createdDate: -1
            }).limit(limit).catch(error => console.log("Error in retrieving answers of post data:" + error));
        },
        votes(obj, {userId}) {
            if (userId) {
                return Vote.find({
                    postId: {$eq: obj.id},
                    userId: {$eq: userId}
                }).limit(1).catch(error => console.log("Error in retrieving votes of post data:" + error))
            }
        }
    },
    Query: {
        postCount: () => {
            return Post.estimatedDocumentCount();
        },
        userPostsCount: (_, {id}) => {
            return Post.countDocuments({userId: id});
        },
        postsById: (_, {id, paginationIndex, limit}) => {
            paginationIndex = paginationIndex ? paginationIndex : 1;
            limit = limit ? limit : 10;
            console.log(paginationIndex, limit);
            return Post.find({userId: id}, null, {
                sort: {createdDate: -1},
                skip: paginationIndex >= 1 ? (paginationIndex - 1) * limit : 0,
                limit: limit
            });
        },
        post: (_, {postId}, {user}) => {
            return Post.findById(postId)
                .then(data => {
                    return data;
                });
        },
        posts: (
            _,
            {sort, paginationIndex, limit, cursorDate}
        ) => {
            //console.log(context);
            cursorDate = cursorDate ? cursorDate : new Date().getTime();
            paginationIndex = paginationIndex ? paginationIndex : 1;
            limit = limit ? limit : 10;
            const sortType =
                sort === "votes"
                    ? {voteValue: -1, createdDate: -1}
                    : {createdDate: -1};

            let searchObj = {};
            let skip =
                paginationIndex >= 1 ? (paginationIndex - 1) * limit : 0;
            if (sort === "new") {
                searchObj = {
                    createdDate: {$lt: cursorDate}
                };
                skip = 0;
            }
            //console.log("---",u,"---");
            return Post.find(searchObj)
                .sort(sortType)
                .skip(skip)
                .limit(limit)
                .then(
                    doc => {
                        console.log(paginationIndex, limit);
                        return doc;
                    },
                    err => {
                        console.log(err);
                        return err;
                    }
                );
        }
    },
    Mutation: {
        createPost: (_, {data}, {user}) => {
            if (!user) throw new AuthenticationError("You must be logged in");
            return Post.create(data).then(
                out => {
                    return out;
                },
                error => error
            );
        },
        updatePost: async (
            _,
            {email, postId, question, description},
            {user}
        ) => {
            user = await user;
            if (user.email === email)
                return Post.findOneAndUpdate(
                    {_id: postId},
                    {heading: question, description},
                    {new: true}
                );
            else
                throw new AuthenticationError(
                    "User don't have access to change this post"
                );
        },
        incViews: (_, {id}) => {
            return Post.findByIdAndUpdate(id, {$inc: {views: 1}}).then(
                out => out.views,
                error => error
            );
        }
    }
};
