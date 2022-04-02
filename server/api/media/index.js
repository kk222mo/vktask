const express = require("express");
var app = module.exports = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const media = require("./media");
const path = require("path");

app.use(bodyParser.urlencoded({extended: false}));
app.use(fileUpload());

app.post("/uploadimage", async (req, res) => {
    if (req.files) {
        let img = req.files.file;
        res.json(await media.addMedia(img));
    } else {
        res.json({"result": "fail", "reason": "no file"});
    }
});

app.get("/media", async (req, res) => {
    var mediaId = req.query.mediaId;
    var mPath = await media.getMediaPath(mediaId);
    if (mPath == null){
        res.json({"result": "fail", "reason": "Cannot find file :("});
        return;
    }
    res.sendFile(path.resolve(mPath));
});