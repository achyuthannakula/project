let mongoose = require("mongoose");

const { ApolloServer, gql, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

import schema from "./models/schema";

//mongodb+srv://achyuth:asd@achyuth-shard-00-01-5p5kc.mongodb.net:27017/project
//mongodb://localhost:27017/project
mongoose
  .connect(
    "mongodb+srv://achyuth:asd@achyuth-5p5kc.mongodb.net/test?retryWrites=true",
    { useFindAndModify: false, useNewUrlParser: true }
  )
  .then(() => {
    console.log("success");
  })
  .catch(err => {
    console.log(err);
    throw new Error("Unable to connect to mongodb......");
  });

const client = jwksClient({
  jwksUri: "https://tachyon.auth0.com/.well-known/jwks.json"
});

function getKey(header, cb) {
  client.getSigningKey(header.kid, function(err, key) {
    let signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
}

const options = {
  audience: "Z999dm2xolFnCiOUE913uNvIiMAq3sOv",
  issuer: "https://tachyon.auth0.com/",
  algorithms: ["RS256"]
};

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    // simple auth check on every request
    //console.log(req.headers.authorization+"--");
    const token = req.headers.authorization || null;
    console.log("--" + token);
    if (token && token.length > 10) {
      const user = new Promise((resolve, reject) => {
        jwt.verify(token, getKey, options, (err, decoded) => {
          //console.log("--error");
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });
      return {
        user
      };
    } else {
      //console.log("else");
      return null;
    }
  }
});

server.listen({ port: 5000, path: "/graphql" }).then(({ url }) => {
  console.log(`ð  Server ready at ${url}`);
});
