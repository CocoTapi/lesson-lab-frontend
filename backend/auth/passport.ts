import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import Database from "../database/Database";

const db = Database.db;

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URL,
            userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                console.log(profile);
                const result = await db.query(
                    "SELECT * FROM users WHERE email = $1",
                    [profile.email]
                );
                if (result.rows.length === 0) {
                    const newUser = await db.query(
                        "INSERT INTO users (email, password) VALUES ($1, $2)",
                        [profile.email, "google"]
                    );
                    return cb(null, newUser.rows[0])
                } else {
                    //Already existing user
                    return cb(null, result.rows[0])
                }
            } catch (err) {
                return cb(err)
            }
        }
    )
)