var mongoose = require("mongoose");
var Entry = require("../models/entry");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

module.exports = function (app) {

    var mongodb = process.env.MONGO || "mongo";

    mongoose.connect(mongodb);

    app.post("/mongodb", urlencodedParser, function (req, res) {
            var data = Entry({
                title: req.body.title,
                body: req.body.body,
            });

            data.save(function (err) {
                if (err) throw err;
                console.log("saved");
            });
            res.redirect("/admintrue");
    });

    app.get("/mongodb/", function (req, res) {
        Entry.find({}, {title: 1, _id:0}, function (err, entries) {
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

    app.delete("/mongodb/:id", function (req, res) {
        Entry.findOneAndRemove({
            _id: req.params.id
        }, function (err) {
            if (err) {
                res.end('error');
                console.log(err);
            } else {
                res.end('success');
                console.log('deleted!');
            }
        });
    });

    app.put("/mongodb/:id", function (req, res) {
        Entry.findByIdAndUpdate({
            _id: req.params.id
        }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('deleted!');
                res.redirect("/admintrue");
            }
        });
    });
}