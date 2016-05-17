var mongoose = require("mongoose");
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

    // Generates hash using bCrypt
    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            console.log('login try');
            // check in mongo if a user with username exists or not
            User.findOne({username: username},
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log error & redirect back
                    if (!user) {
                        console.log('User Not Found with username ' + username);
                        return done(null, false);
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)) {
                        console.log('Invalid Password');
                        return done(null, false);
                    }
                    // User and password both match, return user from 
                    // done method which will be treated like success
                    return done(null, user);
                }
            );
        }));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            console.log('signup try');
            var findOrCreateUser = function(){
                console.log('signup try');
                // find a user in Mongo with provided username
                User.findOne({username: username}, function(err, user){
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+username);
                        return done(null, false);
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = User({
                            username: username,
                            password: createHash(password),
                            email: req.param('email')
                        });
                        // save the user
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
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        }));

    app.get('/admin', function(req, res) {
        // Display the Login page with any flash message, if any
        res.render('admin');
    });

    /* Handle Login POST */
    app.post('/login', urlencodedParser, passport.authenticate('login', {
        successRedirect: '/admintrue',
        failureRedirect: '/fail'
    }));

    /* GET Registration Page */
    app.get('/signup', function(req, res) {
        res.render('register');
    });

    /* Handle Registration POST */
    app.post('/signup', urlencodedParser, passport.authenticate('signup', {
        successRedirect: '/admintrue',
        failureRedirect: '/fail'
    }));

    app.get('/fail', function(req, res){
        res.render('fail');
    });
    /* Handle Logout */
    app.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/admin');
    });
// As with any middleware it is quintessential to call next()
    // if the user is authenticated
    var isAuthenticated = function(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/admin');
    }
    /* GET Home Page */
    app.get('/admintrue', isAuthenticated, function(req, res) {
        res.render('admintrue', { user: req.user });
    });
}