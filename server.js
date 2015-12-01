var express = require('express');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy

var app = express();
app.use(session({secret: 'Green ham spam man yeah man hi'}))


app.use(passport.initialize());
app.use(passport.session());


passport.use(new FacebookStrategy({
	clientID: '1524181241231804',
	clientSecret: '21a90b890d5ad6fa16260be31d9e5ac2',
	callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function(token, refreshToken, profile, done){
	return done(null, profile);
}));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/',
	failureRedirect: '/login'
}), function(req, res){
	console.log(req.session);
})


passport.serializeUser(function(user, done){
	//function called by passport before data is put onto the session
	
	done(null, user)
})

passport.deserializeUser(function(obj, done) {
	//function called by passport after data is pulled from the session
  done(null, obj);
});

app.get('/me', function(req, res){
	var currentLogginInUserOnSession = req.user;
	
	res.send(currentLogginInUserOnSession);
})

app.listen('3000', function(){
	console.log('listening on port 3000');
})