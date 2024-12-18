'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifikasis', {
      idNotifikasi: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,  // Change to INTEGER for auto-increment
        autoIncrement: true    
      },
      idUser: {
        allowNull: false,
        type: Sequelize.INTEGER,  // Change to INTEGER for auto-increment
        references: {
          model: "Users",
          key: "idUser"
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Notifikasis');
  }
};