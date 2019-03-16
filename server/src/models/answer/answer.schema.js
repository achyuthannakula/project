import Answer from './answer.model';

export const answerTypeDefs = `
    type Answer{
        id: ID!
        answer: String!
        createdDate: String!
        updatedDate: String!
        userId: User!
        comments: [Comment]
        votes: [Vote]
        voteValue: Int!
        postId: String!
    }
    input AnswerInput{
        answer: String
        userID: String
        postId: String
    }
    input AnswerUpdate{
        answer: String
        id: String
    }
    extend type Mutation{
        createAnswer(data: AnswerInput!): Answer
        updateAnswer(data: AnswerUpdate!): Answer
    }
`;

export const answerResolver = {
    Mutation: {
        createAnswer: (_, { data }) => {
            return Answer.create(data).then(out => out, error => error);
            // new ApolloError("Error creating Answer object","INTERNAL_SERVER_ERROR");
        },
        updateAnswer: (_, { data }) => {
            return Answer.findByIdAndUpdate(data.id, { $set:{answer: data.answer } }).then( out => out,
                    error => error );
        }
    }
};
