
var FacebookStrategy = require('passport-facebook').Strategy;  
var User = require('./users.js');  
//var configAuth = require('./fbauth');  
module.exports = function(passport) {


	passport.serializeUser(function(user, done){
		done(null, user);
	});

	passport.deserializeUser(function(obj, done){
		/*User.findById(id, function(err, user){
			done(err, user);
		});*/
		done(null,obj);
	});


	passport.use(new FacebookStrategy({  
		clientID: '218660165321390',
		clientSecret: '8d4543cd1e6f6b9a69de3a627f7ab1f7',
		callbackURL: "http://localhost:3000/auth/facebook/callback",
		//passReqToCallback : true,
		profileFields: ['id', 'email', 'first_name', 'last_name'],
	},
	function(token, refreshToken, profile, done) {
		process.nextTick(function() {
		User.findOne({ 'id': profile.id }, function(err, user) {
			if (err)
			return done(err);
			if (user) {
			return done(null, user);
		} else {
			//console.log("We reached here",profile);
			var newUser = new User();
			newUser.id = profile.id;
			newUser.token = token;
			newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
			newUser.email = (profile.emails[0].value || '').toLowerCase();

			newUser.save(function(err) {
				if (err)
				throw err;
				return done(null, newUser);
			});
			
	    	console.log(profile);
			}
		});
		});
  }));
};