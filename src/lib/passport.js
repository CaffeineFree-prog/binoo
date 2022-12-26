import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { pool } from "../database.js";
import * as helpers from "./helpers.js";

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const [rows] = await pool.query(
        "SELECT * FROM user WHERE email = ?",
        [email]
      );

      if (!rows.length) return done(null, false, req.flash("error", "No user found"));

      const user = rows[0];
      const validPassword = await helpers.matchPassword(
        password,
        user.passwordHash
      );

      if (!validPassword) return done(null, false, req.flash("error", "Incorrect Password"));

      done(null, user, req.flash("success", "Welcome " + user.username));
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    if(id != 0){
        const [rows] = await pool.query("SELECT * FROM user WHERE id = ?", [id]);
        done(null, rows[0]);
    } else {
        done(null, false);
    }
});
