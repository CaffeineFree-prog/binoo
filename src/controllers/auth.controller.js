import passport from "passport";
import { encryptPassword } from "../lib/helpers.js";
import { pool } from "../database.js";
import * as helpers from "../lib/helpers.js";

export const renderSignUp = (req, res) => {
  res.render("auth/signup");
};

export const signUp = async (req, res, next) => {
  const { fullname, mobile, email, password1, password2 } = req.body;

  if (password1 !== password2) {
    req.flash("message", "Passwords do not match");
    return res.redirect("/signup");
  }

  const [count] = await pool.query("SELECT COUNT(*) AS result FROM USER WHERE EMAIL = ? ", [email]);
  if(count[0].result != '0' || count[0].result != 0){
    req.flash("message", "이미 사용중인 이메일입니다.");
    return res.redirect("/signup");
  }

  const [count2] = await pool.query("SELECT COUNT(*) AS result FROM USER WHERE MOBILE = ? ", [mobile]);
  if(count2[0].result != '0' || count2[0].result != 0){
    req.flash("message", "이미 사용중인 전화번호입니다.");
    return res.redirect("/signup");
  }

  const newUser = {
    fullname,
    email,
    mobile
  };

  newUser.passwordHash = await encryptPassword(password1);

  // Saving in the Database
  const [result] = await pool.query("INSERT INTO user SET ? ", newUser);
  newUser.id = result.insertId;

  req.login(newUser, (err) => {
    if (err) {
      return next(err);
    }
    return res.redirect("/profile");
  });
}

export const renderSignIn = (req, res, next) => {
  res.render("auth/signin");
};

export const signIn = passport.authenticate("local.signin", {
  successRedirect: "/profile",
  failureRedirect: "/signin",
  failureMessage: true,
  failureFlash: true,
});

export const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
};


export const renderChangePw = async (req, res, next) => {

  const { passwordOrg, password1, password2 } = req.body;
  const id  = req.user.id;
  const email = req.user.email;
  console.log("입력된 비밀번호 : " + passwordOrg);
  const enteredPw = await encryptPassword(passwordOrg);
  console.log("암호화된 임력된 비밀번호 : " + enteredPw);
  console.log("DB 비밀번호 : ");
  console.log(req.user.passwordHash);
  console.log("로그인한 이멜 : " + email);

  const [rows] = await pool.query(
      "SELECT * FROM user WHERE email = ?",
      [email]
  );

  if (!rows.length) {
    req.flash("message", "잘못된 접근입니다.");
    return res.redirect("/user/password");
  }

  const user = rows[0];
  const validPassword = await helpers.matchPassword(
      passwordOrg,
      user.passwordHash
  );

  if (!validPassword) {
    req.flash("message", "기존 비밀번호를 잘못 입력하셨습니다.");
    return res.redirect("/user/password");
  }

  if (password1 !== password2) {
    req.flash("message", "새로운 비밀번호가 서로 일치하지 않습니다");
    return res.redirect("/user/password");
  }

  const newUser = {
    password1
  };

  newUser.password1 = await encryptPassword(password1);

  const [result] = await pool.query("UPDATE user SET passwordHash = ? WHERE id = ? ", [newUser.password1, id]);

  if (!result) {
    req.flash("message", "잘못된 접근입니다.");
    return res.redirect("/user/password");
  }

  newUser.id = req.user.id;

  req.login(newUser, (err) => {
    if (err) {
      return next(err);
     }
     return res.redirect("/profile");
   });

}

