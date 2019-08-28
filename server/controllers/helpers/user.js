const {
  CastAndCrew,
  CastAndCrewType,
  Genre,
  Movie,
  LookupMovieCastAndCrew,
  User
} = require('../../models');
const sequelize = require('sequelize');

module.exports = {
  async confirmUser(userId, slug) {
    const currentUser = await User.findByPk(userId, {
      attributes: ['slug']
    });

    return currentUser.slug === slug;
  },
  async getUserDataFromSlug(slug) {
    const userData = await User.findAll({
      attributes: ['id', 'user_name', 'slug'],
      where: {
        slug
      }
    });

    return userData;
  }
};
