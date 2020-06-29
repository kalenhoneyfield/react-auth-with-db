const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;

//pull in the validation rule set
const { courseRules, validate } = require('./expressValidator');
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
 * GET route to return a list of courses
 * Should return: id, title, description, estimatedTime, materialsNeeded, and the user
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
      include: [{ model: User, attributes: ['firstName', 'lastName', 'emailAddress'] }],
    });
    res.json({ courses });
  })
);

/**
 * GET route to return a course
 * If the param id isn't a number kick an error rather than trying to find the course
 * Should return: id, title, description, estimatedTime, materialsNeeded, and the user
 */
router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (isNaN(id)) {
      res.status(404).json({ message: `Course Not Found for course id: ${id}` });
    } else {
      const course = await Course.findByPk(id, {
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        include: [{ model: User, attributes: ['firstName', 'lastName', 'emailAddress'] }],
      });
      if (!course) {
        res.status(404).json({ message: `Course Not Found for course id: ${id}` });
      } else {
        res.json({ course });
      }
    }
  })
);

/**
 * POST route to create a course
 * title, description and a user are required
 * assuming a successful post:
 * sets Location to id like /api/courses/id
 * status 201 and returns nothing
 * The Rubric and instructions are very vague regarding the "owner" of the course.
 * Because of this, I'm going to assume that the owner is the currently logged in user,
 * however it makes sense why one user might be able to create courses for another user.
 * Note: make sure all code related to owner can easily be adjusted in case my assumption is wrong
 */
router.post(
  '/',
  authUser,
  courseRules(),
  validate,
  asyncHandler(async (req, res) => {
    const newCourse = req.body;
    try {
      const course = await Course.create({
        title: newCourse.title,
        description: newCourse.description,
        estimatedTime: newCourse.estimatedTime,
        materialsNeeded: newCourse.materialsNeeded,
        userId: req.currentUser.id,
      });
      res.location(`/api/courses/${course.id}`);
      res.status(201).end();
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
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

/**
 * PUT route updates a single course
 * If the param id isn't a number kick an error rather than trying to find the course
 * If the course doesn't exist, send a 404 error
 * If the current user, is not the authUser give them a 403 error and do nothing
 * Should return status 204
 */
router.put(
  '/:id',
  authUser,
  courseRules(),
  validate,
  asyncHandler(async (req, res) => {
    const updateCourse = req.body;
    const { id } = req.params;
    if (isNaN(id)) {
      res.status(404).json({ message: `Course Not Found for course id: ${id}` });
    } else {
      const course = await Course.findByPk(id, {
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        include: [{ model: User, attributes: ['firstName', 'lastName', 'emailAddress'] }],
      });
      if (!course) {
        res.status(404).json({ message: `Course Not Found for course id: ${id}` });
      } else if (course.userId !== req.currentUser.id) {
        res.status(403).json({ message: `User is not the owner of course id: ${id}` });
      } else {
        await course.update({
          title: updateCourse.title,
          description: updateCourse.description,
          estimatedTime: updateCourse.estimatedTime,
          materialsNeeded: updateCourse.materialsNeeded,
        });

        res.status(204).end();
      }
    }
  })
);

/**
 * DELETE route to delete a course
 * If the param id isn't a number kick an error rather than trying to find the course
 * If the course doesn't exist, send a 404 error
 * Should return status 204
 */
router.delete(
  '/:id',
  authUser,
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (isNaN(id)) {
      res.status(404).json({ message: `Course Not Found for course id: ${id}` });
    } else {
      const course = await Course.findByPk(id);
      if (!course) {
        res.status(404).json({ message: `Course Not Found for course id: ${id}` });
      } else if (course.userId !== req.currentUser.id) {
        res.status(403).json({ message: `User is not the owner of course id: ${id}` });
      } else {
        await course.destroy();
        res.status(204).end();
      }
    }
  })
);

module.exports = router;
