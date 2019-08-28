'use strict';
module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define(
    'Genre',
    {
      attributes: {
        type: DataTypes.JSONB,
        unique: true
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['name']
        }
      ],
      tableName: 'genres',
      underscored: true
    }
  );
  return Genre;
};
