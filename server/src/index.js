require('babel-register')({
    presets: [ 'env' ]
});
let mongoose = require('mongoose');
let User = require("./models/user/user.model");
let Post = require("./models/post/post.model");
//mongodb+srv://achyuth:asd@achyuth-shard-00-01-5p5kc.mongodb.net:27017/project
//mongodb://localhost:27017/project
mongoose.connect("mongodb+srv://achyuth:asd@achyuth-5p5kc.mongodb.net/test?retryWrites=true", { useNewUrlParser: true }).then(() => {
    console.log("success");

    let achyuth = new Post({
        heading: "Achyuth"
    });
    achyuth.save().then(()=>{
        Post.update({heading:"Achyuth"},{$set: {heading:"wad"}}).then(()=>{
            console.log("After update");
        }).catch(error => {
            throw new Error("update error");
        });
    }).catch(error => {
        throw new Error("save error");
    })



}).catch(err => {
    console.log(err);
    throw new Error("Unable to connect to mongodb......");
});

