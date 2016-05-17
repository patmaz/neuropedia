var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

module.exports = function (app) {

    var mongodb = process.env.MONGO || "mongo";
    mongoose.connect(mongodb);

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

    app.post("/mongodbdel", urlencodedParser, function (req, res) {
        Entry.findOneAndRemove({
            title: req.body.title
        }, function (err) {
            if (err) throw err;
            console.log('deleted!');
        });
        res.redirect("/admintrue");
    });
}