'use strict';
module.exports = (sequelize, DataTypes) => {
  const SearchKeyword = sequelize.define(
    'SearchKeyword',
    {
      attributes: {
        type: DataTypes.JSONB
      },
      word: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['word']
        }
      ]
    }
  );
  return SearchKeyword;
};
