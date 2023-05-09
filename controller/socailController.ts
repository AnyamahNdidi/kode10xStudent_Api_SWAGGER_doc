import passport from "passport";
import { Strategy } from "passport-google-oauth20"
import userMondel from "../Model/userMondel";


const GOOGLE_CLIENT_ID =
  "672291155509-ornlhf2609fcu4107nkn8d74s2s9un8r.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(new Strategy({
    clientID: "889964072554-4hvb40gtdicibq5i4n51tduaoe2mfpsl.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "/auth/google/callback",
    scope: ["email", "profile"],
  },
     async function (
       accessToken: any,
       refreshToken: any,
       profile: any,
       cb: any,
    ) {

      console.log("this is profle",profile);
       const user = await userMondel.findOne({ email: profile._json.email });

      if (user) {
        return cb(null, user);
      } else {
        const newUser = await userMondel.create({ email: profile._json.email });
        return cb(null, newUser);
      }

  }
));

passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user!);
});