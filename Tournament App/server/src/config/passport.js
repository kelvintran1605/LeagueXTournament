import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User.js";
import bcrypt from 'bcrypt';

// serialize user  
passport.serializeUser((user, done) => {
    done(null, user._id);
})

// deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
})

// local strategy
passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    console.log("user name:" + email);
    console.log("password" + password)
    try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: "Wrong password" });

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}))