const { sequelize, models } = require('../models');
const User = require('../models').User;
const Course = require('../models').Course;

async () => {
  try {
    const auth = await sequelize.authenticate();
    const users = await User.findAll({ raw: true }).then((data) => console.log(data));
  } catch (err) {
    throw err;
  }
};
sequelize.authenticate();
User.findAll({
  include: [
    {
      model: Course,
      // as: 'Person',
    },
  ],
  raw: true,
  nest: true,
}).then((data) => console.log(data));
// Course.findAll({
//   include: [
//     {
//       model: User,
//       // as: 'Person',
//     },
//   ],
//   raw: true,
//   nest: true,
// }).then((data) => console.log(data));
