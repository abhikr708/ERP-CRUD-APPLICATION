const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');

// Configure Passport Local Strategy
passport.use(new LocalStrategy( async (username, password, done) => {
    try {
        // console.log('Received Credentials:', email, password);

        // Fetch the user data from the database
        const user = await User.findOne({ email:username });
        if (!user) {
            console.log("User not found");
            return done(null, false, { message: 'Incorrect email' });
        }

        // Compare password using the comparePassword method from User model
        const isPasswordMatch = await user.comparePassword(password);

        if (isPasswordMatch) {
            console.log("Authentication successful");
            return done(null, user);
        } else {
            console.log("Incorrect password");
            return done(null, false, { message: "Incorrect password" });
        }
    } catch (err) {
        console.log("Something went wrong during Authentication");
        return done(err);
    }
}));

// Export configured passport
module.exports = passport;