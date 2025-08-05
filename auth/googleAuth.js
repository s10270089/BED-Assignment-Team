const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { findOrCreateGoogleUser } = require("../models/loginModel");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const dbConfig = require("../dbConfig");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
      accessType: "offline", // Request offline access to get refresh token
      prompt: "consent", // Ensure consent screen is shown to get refresh token
    },
    async function(access_token, refresh_token, profile, done) {
      try {
        console.log("Access Token:", access_token);
        console.log("Refresh Token:", refresh_token || 'No refresh token provided');

        const user = await findOrCreateGoogleUser(profile, access_token, refresh_token);

        const token = jwt.sign({ user_id: user.user_id, email: user.email }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        return done(null, { user, token, access_token, refresh_token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((obj, done) => {
  done(null, obj);
});

passport.deserializeUser((obj, done) => {
  findOrCreateGoogleUser(obj.profile)
    .then(user => done(null, user))
  done(null, obj);
});




async function getGoogleTokens(userId) {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("user_id", sql.Int, userId)
    .query(`
    SELECT access_token, refresh_token
    FROM Users
    WHERE user_id = @user_id
  `);

  const row = result.recordset[0];
  if (!row) return null;

  return {
    access_token: row.access_token,
    refresh_token: row.refresh_token,
  };
}

module.exports = {
  getGoogleTokens,
  // add other exports here if needed
};
