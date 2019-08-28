'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('lookup_movie_cast_and_crew', {
      attributes: {
        type: Sequelize.JSONB
      },
      cast_and_crew_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      movie_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      cast_and_crew_type_id: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('lookup_movie_cast_and_crew');
  }
};
