import db from "../models/index";
import bcrypt from "bcryptjs";
import { hashUserPassword } from "./CrudService";
const salt = bcrypt.genSaltSync(10);

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

let getAllUsers = (userId) => {
  return new Promise(async (relsove, reject) => {
    try {
      let users;
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
        });
      }
      relsove(users);
    } catch (error) {
      reject(error);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (check) {
        resolve({
          errCode: 1,
          errMessage: "Your email is already in used.",
        });
      }
      let hashPassword = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });
      resolve({
        errCode: 0,
        errMessage: "OK",
      });
    } catch (error) {
      reject(error);
    }
  });
};

let deleteUser = (id) => {
  return new Promise(async (relsove, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id },
        raw: false,
      });
      if (!user) {
        relsove({
          errCode: 2,
          errMessage: "User isn't exist",
        });
      } else {
        await user.destroy();
        relsove({
          errCode: 0,
          message: "Deleted",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateUser = (data) => {
  return new Promise(async (relsove, reject) => {
    try {
      if (!data.id) {
        relsove({
          errCode: 2,
          message: "Missing required parameters",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        await user.save();
        relsove({
          errCode: 0,
          message: "Update successful",
        });
      } else {
        relsove({
          errCode: 1,
          message: "User's not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin,
  getAllUsers,
  createNewUser,
  deleteUser,
  updateUser,
};
