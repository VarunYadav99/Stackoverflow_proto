const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

// constructor
// eslint-disable-next-line func-names
const User = function (user) {
  this.username = user.username;
  this.password = user.password;
  this.email = user.email;
  this.location = user.location;
  this.is_admin = user.is_admin;
};


// TODO: Add location, email (Primary for login), reputation
const UsersModelSequelize = db.define('users', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: 'username',
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: 'email',
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  gravatar: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    default: true,
  },
  views: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  mongoId: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  db,
  underscored: true,
  tableName: 'users',
  timestamps: true,
  indexes: [
    {
      name: 'PRIMARY',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'id' },
      ],
    },
    {
      name: 'username',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'username' },
      ],
    },
  ],
});

module.exports = { User, UsersModelSequelize };
