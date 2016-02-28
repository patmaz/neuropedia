var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
var config = require("../config/config");

module.exports = function (app) {

    mongoose.connect(config.mongodb);

    var Schema = mongoose.Schema;

    var entrySchema = new Schema({
        title: String,
        body: String,
        date: {
            type: Date,
            default: Date.now
        },
    });

    var Entry = mongoose.model("entries", entrySchema);

    app.post("/mongodb", urlencodedParser, function (req, res) {

        if (req.body.pass === config.addpass) {
            var data = Entry({
                title: req.body.title,
                body: req.body.body,
            });

            data.save(function (err) {
                if (err) throw err;
                console.log("saved");
            });

            res.redirect("/#/add");
        } else {
            res.send("nope");
        }

    });

    app.get("/mongodb/", function (req, res) {

        Entry.find({}, function (err, entries) {
            if (err) throw err;

            res.send(entries);
        });
    });

    app.get("/mongodb/:id", function (req, res) {

        Entry.find({
            title: req.params.id
        }, function (err, entries) {
            if (err) throw err;

            res.send(entries);
        });
    });

}