const mongoose = require('mongoose');

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
      }
    ]
  })
);

module.exports = User;
