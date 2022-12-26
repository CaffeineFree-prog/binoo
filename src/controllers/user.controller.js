import {pool} from "../database.js";

export const renderUserProfile = (req, res, next) => {
  res.render("profile");
};

export const renderUserview = (req, res, next) => {
  res.render("user/view");
};

export const userEdit = async (req, res) => {
  const id  = req.user.id;
  const { mobile } = req.body;
  const updateUser = {
    mobile
  };
  await pool.query("UPDATE user set ? WHERE id = ?", [updateUser, id]);
  req.flash("success", "성공적으로 변경되었습니다.");
  console.log(id);
  console.log(mobile);
  res.redirect("/");
};

export const renderPassword = (req, res, next) => {
  res.render("user/password");
};

