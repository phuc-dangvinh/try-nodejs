import db from "../models/index";
import CrudService from "../services/CrudService";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homePage.ejs", { data: JSON.stringify(data) });
  } catch (error) {
    console.log(error);
  }
};

let getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
};

let getCRUD = (req, res) => {
  res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let message = await CrudService.createNewUser(req.body);
  console.log(message);
  res.send("post crud from server");
};

let displayGetCRUD = async (req, res) => {
  let users = await CrudService.getAllUsers();
  return res.render("displayCrud.ejs", {
    dataTable: users,
  });
};

let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CrudService.getUserInfoById(userId);
    return res.render("editCrud.ejs", {
      user: userData,
    });
  } else {
    return res.send("Users not found");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUsers = await CrudService.updateUserData(data);
  return res.render("displayCrud.ejs", {
    dataTable: allUsers,
  });
};

let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await CrudService.deleteUserById(id);
    return res.send("Delete user succeed!");
  }
  return res.send("User not found!");
};

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
};
