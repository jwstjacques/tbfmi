'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      attributes: {
        type: DataTypes.JSONB
      },
      email: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      },
      slug: {
        allowNull: false,
        type: DataTypes.STRING
      },
      user_name: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['email']
        },
        {
          unique: true,
          fields: ['slug']
        }
      ],
      tableName: 'users',
      underscored: true
    }
  );
  User.associate = function(models) {
    User.hasMany(models.LookupUserMovie, {
      as: 'UserMovieLibrary',
      foreignKey: 'user_id'
    });
  };
  return User;
};
