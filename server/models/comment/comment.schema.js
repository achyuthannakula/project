import Comment from 'Comment.model';

export const commentTypeDefs = `
    type Comment{
        id: ID!
        comment: String!
        date: String!
        userId: String!
        to: String!
        postId: String
        answerId: String
    }
    Input CommentInput{
        comment: String
        userId: String
        to: String
        toId: { to: String, toId:String}
    }
    extend type Mutation{
        createComment(data: CommentInput!): Comment 
    }
`;

export const commentResolver = {
    Mutation: {
        createComment: (_, { data }) => {
            return  Comment.create(data).then( out => out.toGraph(), error => error);
        }
    }
};