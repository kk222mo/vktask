const db = require("../../database");
const bcrypt = require("bcrypt");
var collection = db.db("vktask").collection("users");

async function getUser(params) {
    var user = await collection.findOne(params);
    return user;
}

async function addUser(uName, uPass) {
    if (await getUser({"userName": uName}) == null) {
        var hashed = await bcrypt.hash(uPass, 10);
        collection.insertOne({"userName": uName, "password": hashed});
        return {"result": "ok"};
    }
    return {"result": "fail", "reason": "User exists"};
}

module.exports = {getUser, addUser};