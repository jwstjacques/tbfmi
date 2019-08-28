'use strict';
module.exports = (sequelize, DataTypes) => {
  const LookupMovieCastAndCrew = sequelize.define(
    'LookupMovieCastAndCrew',
    {
      attributes: {
        type: DataTypes.JSONB
      },
      cast_and_crew_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      cast_and_crew_type_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      movie_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: 'lookup_movie_cast_and_crew',
      underscored: true
    }
  );
  LookupMovieCastAndCrew.associate = function(models) {
    LookupMovieCastAndCrew.belongsTo(models.Movie, {
      foreignKey: 'movie_id',
      onDelete: 'CASCADE'
    });
    LookupMovieCastAndCrew.belongsTo(models.CastAndCrew, {
      foreignKey: 'cast_and_crew_id',
      onDelete: 'CASCADE'
    });
    LookupMovieCastAndCrew.belongsTo(models.CastAndCrewType, {
      foreignKey: 'cast_and_crew_type_id',
      onDelete: 'CASCADE'
    });
  };
  LookupMovieCastAndCrew.removeAttribute('id');
  return LookupMovieCastAndCrew;
};
