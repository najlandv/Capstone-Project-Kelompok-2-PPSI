'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DetailPeminjamans', {
      idPeminjaman: {
        allowNull: false,
        type: Sequelize.INTEGER,      
        references: {
          model: "Peminjamans",
          key: "idPeminjaman"
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      idRuangan: {
        allowNull: false,
        type: Sequelize.INTEGER,  // Change to INTEGER for auto-increment
        references: {
          model: "Ruangans",
          key: "idRuangan"
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      tanggal: {
        type: Sequelize.DATE,
        allowNull: false
      },
      jamMulai: {
        type: Sequelize.TIME,
        allowNull: false
      },
      jamSelesai: {
        type: Sequelize.TIME,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DetailPeminjamans');
  }
};
