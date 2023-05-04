const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../config/db").user;
require("dotenv").config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async function (jwt_payload, done) {
      try {
        const existingUser = await User.findOne({
          where: { userId: jwt_payload.userId },
          attributes: ["userId", "roleId"],
        });

        //If user exists, then attach user to req object otherwise return error
        if (existingUser) {
          return done(null, existingUser);
        } else {
          return done(null, false);
        }
      } catch (err) {
        console.log(err);
        return done(null, false);
      }
    })
  );
};
