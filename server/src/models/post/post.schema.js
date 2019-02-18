import Post from 'post.model';

export const postTypeDefs = `
    type Post{
        id: ID!
        heading: String!
        description: String
        createdDate: String!
        updatedDate: String!
        views: Int
        userId: String!
        comments: [String]
        answers: [String]
    }
    Input PostInput{
        heading: String
        description: String
        userID: String
    }
    extend type Mutation{
        createPost(data: PostInput!): Post
        incViews(id: String) : String23
    }
`;

export const postResolver = {
    Mutation: {
        createPost: (_, { data }) => {
            return  Post.create(data).then( out => out.toGraph(), error => error);
        },
        incViews:(_, { id }) => {
            return Post.findByIdAndUpdate(id, { $inc: { views : 1 } }).then( out => out.views, error => error);
        }
    }
};