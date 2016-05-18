var mongoose = require("mongoose");
var Entry = require("../models/entry");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var passport = require('passport');
var expressSession = require('express-session');

var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(app) {
    app.use(expressSession({
        secret: 'mySecretKey',
        resave: false,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    var superadminpass = process.env.ADMINPASS || "pass";
    var Schema = mongoose.Schema;

    var userSchema = new Schema({
        username: String,
        password: String,
        email: String,
        date: {
            type: Date,
            default: Date.now
        },
    });

    var User = mongoose.model("pass", userSchema);

    var isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    };

    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            console.log('login try');
            User.findOne({username: username},
                function(err, user) {
                    if (err)
                        return done(err);
                    if (!user) {
                        console.log('User Not Found with username ' + username);
                        return done(null, false);
                    }
                    if (!isValidPassword(user, password)) {
                        console.log('Invalid Password');
                        return done(null, false);
                    }
                    return done(null, user);
                }
            );
        }));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            console.log('signup try');
            var findOrCreateUser = function(){
                console.log('signup try');
                User.findOne({username: username}, function(err, user){
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    if (req.body.superadminpass != superadminpass) {
                        console.log('you are not a superadmin');
                        return done(null, false);
                    } else if (user) {
                        console.log('User already exists with username: '+username);
                        return done(null, false);
                    } else {
                        var newUser = User({
                            username: username,
                            password: createHash(password),
                            email: req.body.email
                        });
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            };
            process.nextTick(findOrCreateUser);
        }));

    app.get('/admin', function(req, res) {
        res.render('./admin/admin');
    });

    app.post('/login', urlencodedParser, passport.authenticate('login', {
        successRedirect: '/admintrue',
        failureRedirect: '/fail'
    }));

    app.get('/signup', function(req, res) {
        res.render('./admin/register');
    });

    app.post('/signup', urlencodedParser, passport.authenticate('signup', {
        successRedirect: '/admintrue',
        failureRedirect: '/fail'
    }));

    app.get('/fail', function(req, res){
        res.render('./admin/fail');
    });

    app.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/admin');
    });

    var isAuthenticated = function(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/admin');
    }

    app.get('/admintrue', isAuthenticated, function(req, res) {
        Entry.find({}, function (err, entries) {
            if (err) throw err;
            res.render('./admin/admintrue', {
                user: req.user,
                data: entries
            });
        });
    });
}