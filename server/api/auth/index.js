const express = require("express");
var app = module.exports = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const bcrypt = require("bcrypt");
const users = require("../users");
const credentialsChecker = require("./utils/credentialsChecker");

const tokenGenerator = require("./utils/generateAuthToken");

app.post("/login", async (req, res) => {
    var user = await users.getUser({"userName": req.body.userName});
    if (user != null && await bcrypt.compare(req.body.password, user.password)) {
        res.cookie("token", tokenGenerator.generateAccessToken(req.body.userName), {httpOnly: true});
        res.status(200).json({"result": "ok"});
    } else {
        res.json({"result": "fail", "reason": "Неверное имя пользователя или пароль"});
    }
});

app.post("/register", async (req, res) => {

    var userName = req.body.userName;
    var password = req.body.password;

    if (!credentialsChecker.checkUsername(userName)) {
        res.json({"result": "fail", "reason": "Имя пользователя должно состоять из латинских букв и цифр"});
        return;
    }
    if (!credentialsChecker.checkPassword(password)) {
        res.json({"result": "fail", "reason": "Длина пароля должна быть > 0 :))"});
        return;
    }
    
    var addRes = await users.addUser(userName, password);
    res.json(addRes);
});

app.post("/logout", async (req, res) => {
    res.cookie("token", "", {maxAge: 0});
    res.json({"result": "ok"});
});

app.get("/whoami", async (req, res) => {
    var token = req.cookies.token;
    var user = await credentialsChecker.checkTokenAndGetUser(token);

    res.json({"result": user == null ? "unauthorized" : "authorized", "user": user});
});