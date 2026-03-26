const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Secret = sequelize.define('Secret', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  keyId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  secret: {
    type: DataTypes.STRING,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Secret;
