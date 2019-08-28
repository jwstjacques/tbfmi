'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        'lookup_user_movie',
        [
          {
            movie_id: 1,
            rating: 5,
            user_id: 1,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            movie_id: 2,
            rating: 2,
            user_id: 2,
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        {
          transaction
        }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('lookup_user_movie', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });
  }
};
