import passport from "passport";
import GoogleStrategy from 'passport-google-oauth20';
import Teacher from '../models/teacher.js'; // or User model

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await Teacher.findOne({ googleId: profile.id });
        if (!user) {
            user = await Teacher.create({
                fullName: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
            });
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await Teacher.findById(id);
    done(null, user);
});