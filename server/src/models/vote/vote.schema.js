import Vote from 'vote.model';

export const voteTypeDefs = `
    type Vote{
        id: ID!
        value: String!
        date: String!
        userId: String!
        to: String!
        postId: String
        answerId: String
    }
    Input VoteInput{
        value: String
        userId: String
        to: String
        toId: { to: String, toId:String}
    }
    extend type Mutation{
        createVote(data: VoteInput!): Vote
    }
`;

export const voteResolver = {
    Mutation: {
        createVote: (_, { data }) => {
            return  Vote.create(data).then( out => out.toGraph(), error => error);
        }
    }
};