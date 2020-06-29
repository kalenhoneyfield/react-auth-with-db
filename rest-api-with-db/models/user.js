const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'The value for emailAddress has already been used, and must be unique.',
        },
        validate: {
          isEmail: {
            args: true,
            msg: 'emailAddress must be in standard@format.edu',
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^\$2[aby]?\$\d{1,2}\$[.\/A-Za-z0-9]{53}$/i,
            msg:
              'You should only see this message if express failed to hash your password, please contact the site administrator ASAP',
          },
        },
      },
    },
    {
      sequelize,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Course, {
      //   as: 'Person',
      foreignKey: {
        fieldName: 'userId',
        allowNull: true,
      },
    });
  };

  return User;
};
