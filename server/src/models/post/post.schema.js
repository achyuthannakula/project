import Post from "./post.model";
import { AuthenticationError } from "apollo-server";
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
        comments: [Comment]
        answers: [Answer]
        voteValue: Int
        votes:[Vote]
    }
    extend type Query{
        posts(userId :ID, sort: String!) : [Post]
        post(postId :ID!, userId: ID, answerId: ID) : Post
    }
    input PostInput{
        heading: String
        description: String
        userId:String!
    }
    extend type Mutation{
        createPost(data: PostInput!): Post
        incViews(id: String) : String
    }
`;

export const postResolver = {
  Query: {
    post: async (_, { postId, userId, answerId }, { user }) => {
      const u = await user;

      const votePopulate = [{ path: "userId" }];
      if (userId)
        votePopulate.push({
          path: "votes",
          match: {
            userId: { $eq: userId }
          },
          options: { limit: 1 }
        });

      const matchObject = answerId
        ? {
            match: {
              _id: { $eq: answerId }
            }
          }
        : null;

      return Post.findById(postId)
        .populate({
          path: "answers",
          ...matchObject,
          options: { sort: { voteValue: -1, createdDate: -1 } },
          populate: [
            ...votePopulate,
            {
              path: "comments",
              options: {
                limit: 5,
                sort: { date: -1 }
              },
              populate: {
                path: "userId"
              }
            },
            ...votePopulate
          ]
        })
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
        .then(data => {
          return data;
        });
    },
    posts: async (_, { userId, sort }, { user }) => {
      //console.log(context);
      user = await user;
      const sortType =
        sort === "votes"
          ? { voteValue: -1, createdDate: -1 }
          : { createdDate: -1 };

      const votePopulate = [{ path: "userId" }];
      if (userId)
        votePopulate.push({
          path: "votes",
          match: {
            userId: { $eq: userId }
          },
          options: { limit: 1 }
        });
      //console.log("---",u,"---");
      return Post.find({})
        .populate([
          ...votePopulate,
          {
            path: "answers",
            options: { sort: { voteValue: -1, createdDate: -1 } },
            populate: [
              {
                path: "comments",
                options: {
                  limit: 5,
                  sort: { date: -1 }
                },
                populate: {
                  path: "userId"
                }
              },
              ...votePopulate
            ]
          }
        ])
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
        .sort(sortType)
        .limit(10)
        .then(
          data => {
            return data;
          },
          err => console.log(err)
        );
    }
  },
  Mutation: {
    createPost: (_, { data }, { user }) => {
      if (!user) throw new AuthenticationError("You must be logged in");
      return Post.create(data).then(
        out => {
          return out;
        },
        error => error
      );
    },
    incViews: (_, { id }) => {
      return Post.findByIdAndUpdate(id, { $inc: { views: 1 } }).then(
        out => out.views,
        error => error
      );
    }
  }
};
