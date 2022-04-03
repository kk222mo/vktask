const db = require("../../database");
const mongodb = require("mongodb");
var collection = db.db("vktask").collection("media");
const sharp = require("sharp");
const fs = require("fs");

const MEDIA_NAME_LEN = 20;
const ALLOWED_EXT = ["png", "jpg"];

function generateMediaName(len) {
    const chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
    var res = "";
    for (var i = 0; i < len; i++) {
        res += chars[Math.floor(Math.random() * chars.length)];
    }
    return res;
}

async function addMedia(file) {
    var name = generateMediaName(MEDIA_NAME_LEN);
    var nameParts = file.name.split(".");
    var ext = nameParts[nameParts.length - 1].toLowerCase();
    try {
        if (ALLOWED_EXT.indexOf(ext) != -1 && file.mimetype.split('/')[0] == "image") {
            var newPath = `${__dirname}/../../mediadata/${name}.jpg`;
            await sharp(file.data)
                .resize({
                    fit: sharp.fit.contain,
                    width: 1280                    // resizing image and saving it to storage
                }).toFormat("jpeg")
                .jpeg({quality: 90})
                .toFile(newPath);
            var inserted = await collection.insertOne({filename: name + ".jpg"});
            console.log(inserted);
            return {"result": "ok", "_id": inserted.insertedId};
        }
    } catch (e) {
        console.log(new Date() + " - Плохой формат файла");
    }

    return {"result": "fail", "reason": "Плохой формат файла"};
}

async function getMediaPath(mediaId) {
    var media = await collection.findOne({_id: mongodb.ObjectId(mediaId)});
    if (media == null)
        return null;
    return `${__dirname}/../../mediadata/${media.filename}`;
}

async function deleteMedia(mediaId) {
    var media = await collection.findOne({_id: mongodb.ObjectId(mediaId)});
    if (media != null) {
        try {
            fs.unlinkSync(`${__dirname}/../../mediadata/${media.filename}`);
        } catch (e) {

        }
        await collection.deleteOne({_id: mongodb.ObjectId(mediaId)});
    }
    
}

module.exports = { addMedia, getMediaPath, deleteMedia };