import Post from './post.model';
import User from "../user/user.model";

export const postTypeDefs = `
    type Post{
        id: ID
        _id: ID!
        heading: String!
        description: String
        createdDate: String!
        updatedDate: String!
        views: Int
        userId: User!
        comments: [Comment]
        answers: [Answer]
        userInfo: User
    }
    extend type Query{
        posts : [Post]
        post(id :ID) : Post
    }
    input PostInput{
        heading: String
        description: String
        userId: String
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

            return Post.findById(id).populate('userId')
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
                .populate('answers.comments')
                .then(data => {return data;});
        },
        posts: async (_, {}, { user }) => {
            //console.log(context);
            user = await user;
            //console.log("---",u,"---");
            return Post.find({}).populate('userId').populate('answers')
                .populate({
                    path: 'comments',
                    options: {limit: 5, sort: {date: -1} }
                })
                .sort({'createdDate': -1})
                .limit(10)
                .lean()
                .then(data => {console.log(data);return data;});
        }
    },
    Mutation: {
        createPost: (_, { data }) => {
            return  Post.create(data).then( out => out, error => error);
        },
        incViews:(_, { id }) => {
            return Post.findByIdAndUpdate(id, { $inc: { views : 1 } }).then( out => out.views, error => error);
        }
    }
};