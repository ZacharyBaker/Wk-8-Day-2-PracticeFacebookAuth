var express = require('express');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy
var keys = require('./keys');

var app = express();
app.use(session({secret: 'Green ham spam man yeah man hi'}))


app.use(passport.initialize());
app.use(passport.session());


passport.use(new FacebookStrategy({
	clientID: keys.facebookId,
	clientSecret: keys.facebookSecret,
	callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function(token, refreshToken, profile, done){
	return done(null, profile);
}));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/me',
	failureRedirect: '/login'
}), function(req, res){
	console.log('GoGO POWERRANGERS',req.session);//this isn't doing anything
})


passport.serializeUser(function(user, done){
	//function called by passport before data is put onto the session
	
	done(null, user)
})

var requireAuth = function(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	return res.redirct('/auth/facebook');
}

passport.deserializeUser(function(obj, done) {
	//function called by passport after data is pulled from the session
  done(null, obj);
});

app.get('/me', requireAuth, function(req, res){
	var currentLogginInUserOnSession = req.user;
	
	res.send(currentLogginInUserOnSession);
})

app.listen('3000', function(){
	console.log('listening on port 3000');
})