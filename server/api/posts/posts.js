const db = require("../../database");
const validator = require("validator");
const mongodb = require("mongodb");
const credentialsChecker = require("../auth/utils/credentialsChecker");
const res = require("express/lib/response");
var collection = db.db("vktask").collection("posts");
const media = require("../media/media");

async function getAllPosts(token, skip, count, userId) {
    try{
        var user = await credentialsChecker.checkTokenAndGetUser(token);
        var all = await collection.find((userId ? {author: mongodb.ObjectId(userId)} : {})).sort({"date": -1}).skip(parseInt(skip)).limit(parseInt(count)).toArray();
        all.forEach((e) => {
            e.isOwner = (user != null && user._id.toString() == e.author.toString());
        });
        return {"result": "ok", "count": await collection.countDocuments((userId ? {author: mongodb.ObjectId(userId)} : {})), "data": all};
    } catch (e) {
        return {"result": "fail", "reason": "Что-то пошло не так :("};
    }
    
}

async function addPost(token, text, imageId) {
    var user = await credentialsChecker.checkTokenAndGetUser(token);
    if (user != null) {
        var escaped = validator.escape(text); // To prevent XSS
        if (escaped.trim() == "" && !imageId) // TODO validate text length
            return {"result": "fail", "reason": "И текст и картинка отсутствуют"};
        var inserted = await collection.insertOne({"author": user["_id"], "authorName": user["userName"], "text": escaped,
                                                    "date": new Date(), "imageId": imageId});
        return {"result": "ok", "post": inserted["insertedId"]};
    }   
    return {"result": "fail", "reason": "Пользователь не авторизован"};
}

async function deletePost(token, postId) {
    var user = await credentialsChecker.checkTokenAndGetUser(token);
    var post = await collection.findOne({"_id": mongodb.ObjectId(postId)});
    console.log("post", post, user);
    if (post != null && user != null && post.author.toString() == user._id.toString()) {
        if (post.imageId) {
            await media.deleteMedia(post.imageId);
        }
        await collection.deleteOne({"_id": mongodb.ObjectId(postId)});
        return {"result": "ok"};
    }
    return {"result": "fail", "reason": "Что-то пошло не так :("};

}

module.exports = { getAllPosts, addPost, deletePost };