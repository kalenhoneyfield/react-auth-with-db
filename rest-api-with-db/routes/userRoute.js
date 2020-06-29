const express = require('express');
const router = express.Router();
const User = require('../models').User;
const bcryptjs = require('bcryptjs');

//pull in the validation rule set
const { userRules, validate } = require('./expressValidator');
//pull in authUser.js
const authUser = require('./authUser');

//catch server side errors in one place
function asyncHandler(callback) {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

/**
 * GET route for the current authenticated user
 * should return only firstName, lastName, emailAddress
 */
router.get(
  '/',
  authUser,
  asyncHandler(async (req, res) => {
    const user = await User.findOne({
      attributes: ['firstName', 'lastName', 'emailAddress'],
      where: {
        emailAddress: req.currentUser.emailAddress,
      },
    });
    res.json({ user });
  })
);

/**
 * POST route to create a user
 * Validate that the input contains values, we'll use the DB to validate further but lets prevent blank submissions
 * hash the password value before storing
 */
router.post(
  '/',
  userRules(),
  validate,
  asyncHandler(async (req, res) => {
    const newUser = req.body;
    //hash the password
    newUser.password = bcryptjs.hashSync(newUser.password);
    try {
      await User.create({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        emailAddress: newUser.emailAddress,
        password: newUser.password,
      });
      res.location('/');
      res.status(201).end();
    } catch (error) {
      if (
        error.name === 'SequelizeValidationError' ||
        error.name === 'SequelizeUniqueConstraintError'
      ) {
        const errorMessage = [];
        error.errors.map((err) => errorMessage.push(err.message));
        return res.status(400).json({
          errors: errorMessage,
        });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
