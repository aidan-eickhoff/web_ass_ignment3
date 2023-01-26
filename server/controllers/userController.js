const User = require('../../models/user');

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
exports.find = async (req, res) => {
  let searchTerm = req.body.search;
  const users = await userModel.searchUsers(searchTerm);
  res.render('home', { users });
}

exports.form = (req, res) => {
  res.render('add-user');
}

// Add new user
exports.create = async (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  await userModel.createUser(first_name, last_name, email, phone, comments);
  res.render('add-user', { message: 'User added successfully.' });
}


// Edit user
exports.edit = async (req, res) => {
  const users = await userModel.editUser(req.params.id);
  res.render('edit-user', { users });
}


// Update User
exports.update = async (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  const users = await userModel.updateUser(first_name, last_name, email, phone, comments, req.params.id);

  res.render('edit-user', { users, message: `${first_name} has been updated.` });

}

// Delete User
exports.delete = async (req, res) => {
  const message = await userModel.deleteUser(req.params.id);
  res.redirect('/?removed=' + message);
}

// View Users
exports.viewUser = async (req, res) => {
  const data = await userModel.viewUser(req.params.id);
  res.render('view-user', { data });

}