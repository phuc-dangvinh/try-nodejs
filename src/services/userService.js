import db from "../models/index";
import bcrypt from "bcryptjs";

let handleUserLogin = (email, password) => {
  return new Promise(async (relsove, reject) => {
    try {
      let userData = {};
      let userExist = await checkUserEmail(email);
      if (userExist) {
        let user = await db.User.findOne({
          attributes: ["email", "roleId", "password"],
          where: { email },
          raw: true,
        });
        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = `Ok`;
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = `Wrong password`;
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User's not found!`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Your's email isn't exits in your system, Please try other email!`;
      }
      relsove(userData);
    } catch (error) {}
  });
};

let checkUserEmail = (email) => {
  return new Promise(async (relsove, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email },
      });
      if (user) {
        relsove(true);
      } else {
        relsove(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin,
};
