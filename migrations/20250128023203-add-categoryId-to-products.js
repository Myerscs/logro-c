'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'categoryId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Cambia a `false` si deseas que sea obligatorio
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'categoryId');
  },
};
