const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Role schema
const RoleSchema = new Schema({
  role_name: {
    type: String,
    unique: true,
    required: true,
    maxlength: 60
  }
});

// Create the Role model
const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;
