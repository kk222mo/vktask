
const jwt = require("jsonwebtoken");
const users = require("../../users");

function checkUsername(uName) {
    return uName != null && /^[a-zA-Z0-9]+$/g.test(uName);
}

function checkPassword(uPass) {
    return uPass != null && uPass.length > 0;
}

async function checkTokenAndGetUser(token) {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return await users.getUser({"userName": decoded["userName"]});
    } catch (e) {
        return null;
    }
}

module.exports = {checkUsername, checkPassword, checkTokenAndGetUser};
