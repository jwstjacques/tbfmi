'use strict';
module.exports = (sequelize, DataTypes) => {
  const CastAndCrew = sequelize.define(
    'CastAndCrew',
    {
      attributes: {
        type: DataTypes.JSONB
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'cast_and_crew',
      underscored: true
    }
  );
  CastAndCrew.associate = function(models) {
    CastAndCrew.hasMany(models.LookupMovieCastAndCrew, {
      as: 'MovieCastAndCrew',
      foreignKey: 'cast_and_crew_id'
    });
  };
  return CastAndCrew;
};
