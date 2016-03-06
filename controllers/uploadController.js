var fs = require("fs");
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});
var upload = multer({
    storage: storage, 
    limits: { fileSize: 30 * 1000 },
    fileFilter: function(req, file, cb) {
        if (file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            return cb(new Error("only jpegs!"));
        }
    }
});

module.exports = function (app) {

    app.post('/upload', upload.single('somefile'), function (req, res) {

        console.log(req.file);
        res.redirect("/#/upload");
        
    });
}