'use strict';
const {
  Model,
  INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notifikasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Notifikasi.belongsTo(models.User, { foreignKey: 'idUser' });
    }
  }
  Notifikasi.init({
    idNotifikasi: {
      type: INTEGER, 
      autoIncrement: true,
      primaryKey: true,
    },
    idUser: {
      type: INTEGER, 
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Notifikasi',
  });
  return Notifikasi;
};