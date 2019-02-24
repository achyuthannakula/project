'use strict';

var _schema = require('./models/schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');

var _require = require('apollo-server'),
    ApolloServer = _require.ApolloServer,
    gql = _require.gql,
    AuthenticationError = _require.AuthenticationError;

var jwt = require('jsonwebtoken');
var jwksClient = require('jwks-rsa');

//mongodb+srv://achyuth:asd@achyuth-shard-00-01-5p5kc.mongodb.net:27017/project
//mongodb://localhost:27017/project
mongoose.connect("mongodb+srv://achyuth:asd@achyuth-5p5kc.mongodb.net/test?retryWrites=true", { useNewUrlParser: true }).then(function () {
    console.log("success");
}).catch(function (err) {
    console.log(err);
    throw new Error("Unable to connect to mongodb......");
});

var client = jwksClient({
    jwksUri: 'https://tachyon.auth0.com/.well-known/jwks.json'
});

function getKey(header, cb) {
    client.getSigningKey(header.kid, function (err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        cb(null, signingKey);
    });
}

var options = {
    audience: 'Z999dm2xolFnCiOUE913uNvIiMAq3sOv',
    issuer: 'https://tachyon.auth0.com/',
    algorithms: ['RS256']
};

var server = new ApolloServer({
    schema: _schema2.default,
    context: function context(_ref) {
        var req = _ref.req;

        // simple auth check on every request
        var token = req.headers.authorization;
        if (token) {
            var user = new Promise(function (resolve, reject) {
                jwt.verify(token, getKey, options, function (err, decoded) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(decoded.email);
                });
            });
            return {
                user: user
            };
        } else {
            return { user: "guest" };
        }
    }
});

server.listen({ port: 5000, path: "/graphql" }).then(function (_ref2) {
    var url = _ref2.url;

    console.log('\uD83D\uDE80  Server ready at ' + url);
});