'use strict';
module.exports = (sequelize, DataTypes) => {
  const LookupUserMovie = sequelize.define(
    'LookupUserMovie',
    {
      attributes: {
        type: DataTypes.JSONB
      },
      movie_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      rating: {
        type: DataTypes.INTEGER
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['movie_id', 'user_id']
        }
      ],
      tableName: 'lookup_user_movie',
      underscored: true
    }
  );
  LookupUserMovie.associate = function(models) {
    LookupUserMovie.belongsTo(models.Movie, {
      foreignKey: 'movie_id'
    });
    LookupUserMovie.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };
  LookupUserMovie.removeAttribute('id');
  return LookupUserMovie;
};
