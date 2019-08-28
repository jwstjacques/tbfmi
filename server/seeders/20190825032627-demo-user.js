'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const password = await bcrypt.hash('1234', 10);

      await queryInterface.bulkInsert(
        'users',
        [
          {
            email: 'test@test.com',
            password,
            slug: 'testuser',
            user_name: 'testUser',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            email: 'test2@test.com',
            password,
            slug: 'testuser2',
            user_name: 'testUser',
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
    await queryInterface.bulkDelete('users', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    });
  }
};
