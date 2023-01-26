const mysql = require('mysql');
const User = require('../../models/user');
const e = require("express");

// Connection Pool
const userModel = new User(
    process.env.DB_HOST,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    process.env.DB_NAME
);

// View Users
exports.view = async (req, res) => {
  const users = await userModel.selectActiveUsers();
  let removedUser = req.query.removed;
  res.render('home', { users, removedUser });
}

// Find User by Search
exports.find = (req, res) => {
  let searchTerm = req.body.search;
  const users = userModel.searchUsers(searchTerm);
  console.log(users);
  res.render('home', { users });
}

exports.form = (req, res) => {
  res.render('add-user');
}

// Add new user
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  userModel.createUser(first_name, last_name, email, phone, comments);
  res.render('add-user', { alert: 'User added successfully.' });
}


// Edit user
exports.edit = (req, res) => {
  const users = userModel.editUser(req.params.id);
  console.log(users);
  res.render('edit-user', { users });
}


// Update User
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  const {users, name} = userModel.updateUser(first_name, last_name, email, phone, comments, req.params.id);

  res.render('edit-user', { users, alert: `${name} has been updated.` });

}

// Delete User
exports.delete = (req, res) => {
  const message = userModel.deleteUser(req.params.id);
  res.redirect('/?removed=' + message);
}

// View Users
exports.viewall = (req, res) => {
  const user = userModel.viewActiveUsers(req.params.id);
  res.render('view-user', { user });

}