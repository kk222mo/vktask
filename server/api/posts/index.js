const express = require("express");
const posts = require("./posts");
var app = module.exports = express();


app.get("/posts", async (req, res) => {
    var token = req.cookies.token;
    var count = req.query.count || 10;
    var skip = req.query.skip || 0;
    var user = req.query.user || "";
    res.json(await posts.getAllPosts(token, skip, count, user));
});

app.post("/newpost", async (req, res) => {
    var token = req.cookies.token;
    var text = req.body.text;
    var imageId = req.body.imageId;
    res.json(await posts.addPost(token, text, imageId));
});

app.post("/deletepost", async (req, res) => {
    var token = req.cookies.token;
    var postId = req.body.postId;
    res.json(await posts.deletePost(token, postId));
});