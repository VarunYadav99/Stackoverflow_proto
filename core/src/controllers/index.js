const answersController = require('./answers.controller');
const commentsController = require('./comments.controller');
const postsController = require('./posts.controller');
const tagsController = require('./tags.controller');
const usersController = require('./users.controller');
const authController = require('./auth.controller');
const dashboardController = require('./dashboard.controller');

module.exports = {
  answersController,
  commentsController,
  dashboardController,
  postsController,
  tagsController,
  usersController,
  authController,
};
