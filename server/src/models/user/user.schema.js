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
        userUpdate: User
    }
    extend type Query{
        user: User
    }
    extend type Mutation{
        createUser(data: UserInput!): User
    }
`;
export const userResolver = {
    Query: {
        user: async (_, {}, { user }) => {
            user = await user;
            if(user == null)
                return null;
            else
                return User.findOne({email: user.email}).then(doc => doc, err => err);
            //return User.findById(id).populate('posts').populate('answers').then(data => {console.log(context);return data;});
        },
        userUpdate: async (_, {}, { user }) => {
            user = await user;
            return User.findOneAndUpdate({email: user.email},
                {name: user.name, username: user.nickname, email: user.email, email_verified: user.email_verification, profilePicture: user.picture, via: user.sub},
                { upsert: true, new: true } ).
            then(doc => doc, err => err);
        }
    },
    Mutation:{
        createUser: (_, { data }) => {
            return User.create(data).then(doc => doc, err => err);
        }
    }
};
