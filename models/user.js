'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // ✅ Automatically generates UUID
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, // ✅ Ensures password is always required
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // ✅ Default is `false`
      },
      verificationOTP: {
        type: DataTypes.STRING,
      },
      otpExpiredAt: {
        type: DataTypes.DATE,
      },
      profileImage: {
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // ✅ Ensures timestamps work
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // ✅ Ensures timestamps work
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'User', 
      freezeTableName: true, 
    }
  );

  return User;
};
