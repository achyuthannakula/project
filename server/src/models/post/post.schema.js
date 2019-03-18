import Post from './post.model';
import { AuthenticationError } from 'apollo-server'
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
        posts(id :ID, sort: String!) : [Post]
        post(id :ID) : Post
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
    Query:{
        post: async (_, { id }, {user}) => {

            const u = await user;

            return Post.findOne({_id :id}).populate('userId')
                .populate({
                    path: "answers",
                    populate: {
                        path: "comments",
                        options: {
                            limit: 5,
                            sort: {date: -1}
                        }
                    }
                })
                .populate('comments')
                .then(data => {return data;});
        },
        posts: async (_, { id, sort }, { user }) => {
            //console.log(context);
            user = await user;
            const sortType = sort === "votes" ? {voteValue: -1, createdDate: -1} : {createdDate: -1};
            //console.log("---",u,"---");
            if (id)
                return Post.find({}).populate('userId')
                    .populate({
                        path: 'answers',
                        options: {limit: 1, sort: {voteValue: -1, date: -1} },
                        populate: {
                            path: 'userInfo'
                        }
                    })
                    .populate({
                        path: 'comments',
                        options: {limit: 5, sort: {date: -1}},
                        populate: {
                            path: 'userInfo'
                        }
                    })
                    .populate({
                        path: 'votes',
                        match: {
                            userId : {$eq: id}
                        },
                        options: {limit : 1}
                    })
                    .sort(sortType)
                    .limit(10)
                    .then(data => {return data;});
            else
                return Post.find({}).populate('userId')
                    .populate({
                        path: 'answers',
                        options: {limit: 1, sort: {voteValue: -1, date: -1} },
                        populate: {
                            path: 'userInfo'
                        }
                    })
                    .populate({
                        path: 'comments',
                        options: {limit: 5, sort: {date: -1}},
                        populate: {
                            path: 'userInfo'
                        }
                    })
                    .sort({'createdDate': -1})
                    .limit(10)
                    .then(data => {return data;});
        }
    },
    Mutation: {
        createPost: (_, { data }, { user }) => {
            if(!user)
                throw new AuthenticationError('You must be logged in');
            return  Post.create(data).then( out => {return out}, error => error);
        },
        incViews:(_, { id }) => {
            return Post.findByIdAndUpdate(id, { $inc: { views : 1 } }).then( out => out.views, error => error);
        }
    }
};