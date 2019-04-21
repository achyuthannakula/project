import Post from "./post.model";
import Comment from "../comment/comment.model";
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
        commentsCount: Int!
        answers: [Answer]
        voteValue: Int
        votes:[Vote]
    }
    extend type Query{
        postCount: Int
        userPostsCount(id: ID!): Int!
        postsById(id: ID!, paginationIndex: Int, noPostsInPage: Int): [Post]
        posts(userId :ID, sort: String!, paginationIndex: Int, noPostsInPage: Int, cursorDate: String) : [Post]
        post(postId :ID!, userId: ID, answerId: ID, noPostsInPage: Int) : Post
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
      return Comment.countDocuments({ postId: obj.id });
    }
  },
  Query: {
    postCount: () => {
      return Post.estimatedDocumentCount();
    },
    userPostsCount: (_, { id }) => {
      return Post.countDocuments({ userId: id });
    },
    postsById: (_, { id, paginationIndex, noPostsInPage }) => {
      paginationIndex = paginationIndex ? paginationIndex : 1;
      noPostsInPage = noPostsInPage ? noPostsInPage : 10;
      console.log(paginationIndex, noPostsInPage);
      return Post.find({ userId: id }, null, {
        sort: { createdDate: -1 },
        skip: paginationIndex >= 1 ? (paginationIndex - 1) * noPostsInPage : 0,
        limit: noPostsInPage
      });
    },
    post: async (_, { postId, userId, answerId, noPostsInPage }, { user }) => {
      const u = await user;
      noPostsInPage = noPostsInPage ? noPostsInPage : 10;

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
        .populate("userId")
        .populate({
          path: "answers",
          ...matchObject,
          options: {
            sort: { voteValue: -1, createdDate: -1 },
            limit: noPostsInPage
          },
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
    posts: async (
      _,
      { userId, sort, paginationIndex, noPostsInPage, cursorDate },
      { user }
    ) => {
      //console.log(context);
      cursorDate = cursorDate ? cursorDate : new Date().getTime();
      paginationIndex = paginationIndex ? paginationIndex : 1;
      noPostsInPage = noPostsInPage ? noPostsInPage : 10;
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

      let searchObj = {};
      let skip =
        paginationIndex >= 1 ? (paginationIndex - 1) * noPostsInPage : 0;
      if (sort === "new") {
        searchObj = {
          createdDate: { $lt: cursorDate }
        };
        skip = 0;
      }
      //console.log("---",u,"---");
      return Post.find(searchObj)
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
        .skip(skip)
        .limit(noPostsInPage)
        .then(
          doc => {
            console.log(paginationIndex, noPostsInPage);
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
    createPost: (_, { data }, { user }) => {
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
      { email, postId, question, description },
      { user }
    ) => {
      user = await user;
      if (user.email === email)
        return Post.findOneAndUpdate(
          { _id: postId },
          { heading: question, description },
          { new: true }
        );
      else
        throw new AuthenticationError(
          "User don't have access to change this post"
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
