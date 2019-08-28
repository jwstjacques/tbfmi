'use strict';
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define(
    'Movie',
    {
      attributes: {
        type: DataTypes.JSONB
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      release_date: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      tableName: 'movies',
      underscored: true
    }
  );
  Movie.associate = function(models) {
    Movie.hasMany(models.LookupMovieCastAndCrew, {
      as: 'MovieCastAndCrew',
      targetKey: 'cast_and_crew_id'
    });
    Movie.hasMany(models.LookupUserMovie, {
      as: 'UserMovie',
      targetKey: 'movie_id'
    });
  };

  return Movie;
};
