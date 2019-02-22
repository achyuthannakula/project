import User from './user.model';

export const userTypeDefs = `
    type User{
        id: ID!
        name: String!
        username: String!
        email: String!
        email_verified: Boolean
        profilePicture: String
        views: Int
        via: String
        posts:[Post]
        answers:[Answer] 
    }
    input UserInput{
        name: String!
        username: String!
        email: String!
        email_verified: Boolean
        profilePicture: String
        via: String
    }
    extend type Query{
        user(id: String): User
    }
    extend type Mutation{
        createUser(data: UserInput!): User
    }
`;
export const userResolver = {
    Query: {
        user: (_, { id }, context) => {
            return User.findById(id).populate('posts').populate('answers').then(data => {console.log(context);return data;});
        }
    },
    Mutation:{
        createUser: (_, { data }) => {
            return User.create(data).then(doc => doc, err => err);
        }
    }
};
