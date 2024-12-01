'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      idUser: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER, 
        autoIncrement: true    
      },
      idRole: {
        type: Sequelize.INTEGER,  // Change to INTEGER for auto-increment
        references: {
          model: "Roles",
          key: "idRole"
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      noHp: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gender: {
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
    await queryInterface.dropTable('Users');
  }
};