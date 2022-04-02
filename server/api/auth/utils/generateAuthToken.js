const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
    return jwt.sign({"userName": user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "30d"});
}

module.exports = {generateAccessToken};