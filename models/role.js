'use strict';
const {
  Model,
  Sequelize,
  STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.hasMany(models.User, { foreignKey: 'idRole' });
    }
  }
  Role.init({
    idRole: {
      type: Sequelize.INTEGER, 
      autoIncrement: true,
      primaryKey: true,
    },
    namaRole: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, 
  {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};