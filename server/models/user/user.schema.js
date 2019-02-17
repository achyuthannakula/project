import User from 'user.model';

export const userTypeDefs = `
    type User{
        id: ID!
        name: String!
        username: String!
        email: String!
        profilePicture: String
        views: Int
        posts:[Post]
        answers:[Answer] 
    }
    extend type Query{
        user(id: String): User
    }
`;

export const userResolver = {
    Query: {
        user: (_, { id }) => {
            return User.findById(id).exec((error, doc) => {
                if(error)
                    console.log(error);
                return doc.toGraph();
            })
        }
    }
};