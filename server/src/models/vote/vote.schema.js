import Vote from './vote.model';
import Post from '../post/post.model'
import Answer from '../answer/answer.model'
import { AuthenticationError } from 'apollo-server'

export const voteTypeDefs = `
    type Vote{
        id: ID!
        value: String!
        date: Int!
        userId: String!
        to: String!
        postId: String
        answerId: String
    }
    input VoteInput{
        value: Int
        userId: String
        to: String
        toId: String
    }
    extend type Mutation{
        createOrUpdateVote(data: VoteInput!): Vote
    }
`;

export const voteResolver = {
    Mutation: {
        createOrUpdateVote: async (_, { data }, { user }) => {
            if(!user)
                throw new AuthenticationError('You must be logged in');

            let toKey = 'postId';
            if(data.to === 'answer')
                toKey = 'answerId';

            return Vote.findOne({userId: data.userId, [toKey]: {$in: data.toId }}).then(async out => {
                const val =  -(out ? out.value : 0) + data.value;
                console.log(data);
                if (data.to === 'post') {
                    await Post.findOneAndUpdate({_id: data.toId}, {$inc: {voteValue: val}});
                } else {
                    await Answer.findOneAndUpdate({_id: data.toId}, {$inc: {voteValue: val}});
                }

                if(!out)
                    return  Vote.create(data).then( out => out, error => error);
                out.value = data.value;
                return out.save();
            }, err => err)
            //return  Vote.create(data).then( out => out, error => error);
        }
    }
};