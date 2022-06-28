const express = require('express');
const { check } = require('express-validator');
const { tagsController } = require('../controllers');
const { auth, checkTagExistence } = require('../middleware');

const router = express.Router();

/** @route      GET /api/tags
 *  @desc       fetch all tags
 */
router.route('/')
  .get(tagsController.getTags);

/** @route      GET /api/posts/:id
 *  @desc       fetch a single post
 */
router.route('/:tagname')
  .get(tagsController.getSingleTag);

/** @route      POST /api/tag/create
 *  @desc       fetch a single post
 */
router.route('/create')
  .post(
    auth,
    check('tagname', 'Tag name should contains at least 3 character')
      .isLength({ min: 3 }),
    check('tagname', 'Tag name is required')
      .not()
      .isEmpty(),
    check('description', 'Description is required')
      .not()
      .isEmpty(),
    checkTagExistence,
    tagsController.createTag,
  );

module.exports = router;
