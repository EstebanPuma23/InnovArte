'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING(300)
      },
      price: {
        allowNull: false,
        type: Sequelize.DECIMAL(8,2)
      },
      image: {
        allowNull: false,
        type: Sequelize.STRING
      },
      discount: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      categoryId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Categories'
          },
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: null
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null

      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  }
};