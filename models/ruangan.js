'use strict';
const { Model, DataTypes, INTEGER } = require('sequelize');

module.exports = (sequelize) => {
  class Ruangan extends Model {
    static associate(models) {
      Ruangan.hasMany(models.DetailPeminjaman, { as: 'detailPeminjaman', foreignKey: 'idRuangan' });
    }
  }
  Ruangan.init({
    idRuangan: {
      type: DataTypes.UUID,
      primaryKey: true,
      type: INTEGER, 
      autoIncrement: true,
    },
    namaRuangan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kapasitas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fasilitas: {
      type: DataTypes.STRING,
      allowNull: false
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    statusKetersediaan: {
      type: DataTypes.ENUM('Tersedia', 'Dipinjam'),
      allowNull: false,
      defaultValue: 'Tersedia',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Ruangan',
  });
  return Ruangan;
};