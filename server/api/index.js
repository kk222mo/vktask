const express = require("express");

var app = module.exports = express();

const auth = require('./auth');
app.use(auth);

const posts = require('./posts');
app.use(posts);

const media = require('./media');
app.use(media);