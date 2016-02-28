var fs = require("fs");
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});
var upload = multer({ storage: storage });

module.exports = function (app) {

//    app.post('/upload', upload.single('somefile'), function (req, res) {
//
//        console.log(req.file);
//
//    });
}