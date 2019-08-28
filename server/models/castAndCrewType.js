'use strict';
module.exports = (sequelize, DataTypes) => {
  const CastAndCrewType = sequelize.define(
    'CastAndCrewType',
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'cast_and_crew_types',
      underscored: true
    }
  );
  CastAndCrewType.associate = function(models) {
    CastAndCrewType.hasMany(models.LookupMovieCastAndCrew, {
      as: 'CastAndCrewType',
      foreignKey: 'cast_and_crew_type_id'
    });
  };
  return CastAndCrewType;
};
