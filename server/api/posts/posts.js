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
            e.isLiked = (user && e.likes && e.likes[user._id] == 1);
            e.likesCount = e.likes ? Object.values(e.likes).filter(v => v === 1).length : 0;
        });
        return {"result": "ok", "count": await collection.countDocuments((userId ? {author: mongodb.ObjectId(userId)} : {})), "data": all};
    } catch (e) {
        console.log(e);
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

async function putLike(token, postId) {
    var user = await credentialsChecker.checkTokenAndGetUser(token);
    var post = await collection.findOne({"_id": mongodb.ObjectId(postId)});
    if (post != null && user != null && post.author.toString() != user._id.toString()) {
        var likes = post.likes;
        if (!likes)
            likes = {};
        if (!likes[user._id] || likes[user._id] == -1)
            likes[user._id] = 1;
        else {
            likes[user._id] = -1;
        }
        await collection.updateOne({"_id": mongodb.ObjectId(postId)}, {
            $set: {"likes": likes}
        });
        return {result: "ok", liked: likes[user._id], likesCount: Object.values(likes).filter(v => v == 1).length};
    }
    return {"result": "fail", "reason": "Что-то пошло не так :("};
}

module.exports = { getAllPosts, addPost, deletePost, putLike };