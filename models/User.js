const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
  ,
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  profile_image: {
  type: DataTypes.STRING, // or TEXT if storing URLs
  allowNull: true
}
}, {
  tableName: 'users',
  underscored: true, // 👈 This changes createdAt → created_at
  timestamps: true   // 👈 Ensure timestamps are enabled (default is true)
});

module.exports = User;
