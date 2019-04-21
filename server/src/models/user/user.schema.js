import User from "./user.model";
import { AuthenticationError } from "apollo-server";
const axios = require("axios");

export const userTypeDefs = `
    type User{
        id: ID!
        name: String!
        username: String!
        email: String!
        email_verified: Boolean
        profilePicture: String
        deleteHash: String
        job: String
        department: String
        location: String
        views: Int
        via: String
        posts:[Post]
        answers:[Answer] 
    }
    input UserInput{
        name: String
        username: String
        email: String
        email_verified: Boolean
        profilePicture: String
        via: String
    }
    input UserUpdateInput{
        email: String
        name: String
        profilePicture: String
        deleteHash: String
        job: String
        department: String
        location: String
    }
    extend type Query{
        userById(id: ID!): User
        userCreateOrUpdate: User
        user: User
    }
    extend type Mutation{
        userUpdate(data: UserUpdateInput): User
        createUser(data: UserInput!): User
    }
`;
export const userResolver = {
  Query: {
    userById: (_, { id }) => {
      return User.findById(id);
    },
    user: async (_, {}, { user }) => {
      user = await user;
      if (user == null) return null;
      else
        return User.findOne({ email: user.email }).then(doc => doc, err => err);
      //return User.findById(id).populate('posts').populate('answers').then(data => {console.log(context);return data;});
    },
    userCreateOrUpdate: async (_, {}, { user }) => {
      user = await user;
      console.log("user", user);
      return User.find({ email: user.email })
        .limit(1)
        .then(doc => {
          console.log("doc", doc);
          if (doc.length === 0) {
            let newUser = new User({
              name: user.name,
              username: user.nickname,
              email: user.email,
              email_verified: user.email_verification,
              profilePicture: user.picture,
              via: user.sub
            });
            return newUser.save().then(doc => console.log(doc));
          }
          return doc[0];
        });
    }
  },
  Mutation: {
    createUser: (_, { data }) => {
      return User.create(data).then(doc => doc, err => err);
    },
    userUpdate: async (_, { data }, { user }) => {
      //console.log(data);
      user = await user;
      if (user.email === data.email) {
        if (data.profilePicture && data.profilePicture.indexOf("imgur") < 0) {
          console.log("\n\n\n----\n\n\n");
          if (data.profilePicture.indexOf("base64") > 0)
            data.profilePicture = data.profilePicture.split(",")[1];
          if (data.deleteHash) {
            console.log("indelete");
            axios({
              method: "delete",
              baseURL: "https://api.imgur.com/3/",
              url: "/image/" + data.deleteHash,
              headers: {
                Authorization: "Client-ID 9e464582fd060d4"
              }
            })
              .then(res => {
                console.log("--", res.statusText);
              })
              .catch(err => {
                console.log(err);
              });
          }
          await axios({
            method: "post",
            baseURL: "https://api.imgur.com/3/",
            url: "/upload",
            headers: {
              Authorization: "Client-ID 9e464582fd060d4"
            },
            data: {
              image: data.profilePicture
            }
          })
            .then(res => {
              console.log(res.data, res.data.data.deletehash);
              data.profilePicture = res.data.data.link;
              data.deleteHash = res.data.data.deletehash;
              console.log(data);
            })
            .catch(err => {
              console.log(err);

              throw new AuthenticationError("Server Error");
            });
        }
        return User.findOneAndUpdate(
          { email: data.email },
          { ...data },
          { new: true }
        ).then(doc => {
          console.log(doc);
          return doc;
        });
      }
      throw new AuthenticationError(
        "User don't have access to change this user details"
      );
    }
  }
};
