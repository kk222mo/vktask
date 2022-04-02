require("dotenv").config();

const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3232;

const db = require("./database");

db.connect().then(() => {
    console.log("Connected to MongoDB!");

    const app = express();
    app.use(express.json());



    app.use(express.static(path.resolve(__dirname, "../client/build")));
    

    const api = require('./api');
    app.use(api);

    app.use(function(err, req, res, next) {
        console.log(err.stack);
        res.status(500).json({result: "fail", reason: "something broke"});
    });


    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    });

})

