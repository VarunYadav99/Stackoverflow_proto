const express = require('express');
const {
  auth,
  checkOwnership
} = require('../middleware');
const { allUsers } = require('../controllers/users.controller');

const router = express.Router();

router.use('/auth', require('./auth.router'));
router.use('/users', require('./users.router'));
router.use('/posts', require('./posts.router'));
router.use('/tags', require('./tags.router'));
router.use('/posts/answers', require('./answers.router'));
router.use('/posts/comments', require('./comments.router'));
router.use('/chat', require('./chat.router'));
router.use('/message', require('./message.router'));
// router.use('/dashboard', require('./dashboard.router'));

router.route('/user')
  .get(auth, allUsers);

module.exports = router;
