

passport.use(new FacebookStrategy({
    clientID: '218660165321390',
    clientSecret: '8d4543cd1e6f6b9a69de3a627f7ab1f7',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));