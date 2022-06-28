const {
  responseHandler,
  asyncHandler
} = require('../helpers');
const { tagsService } = require('../services');
const { Tag } = require('../models');
const { validationResult } = require('express-validator');

exports.getTags = asyncHandler(async (req, res) => {
  try {
    await tagsService.retrieveAll((err, data) => {
      if (err) {
        console.log(err);
        return res.status(err.code)
          .json(err);
      }
      return res.status(data.code)
        .json(data);
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseHandler(false, 500, 'Server Error', null));
  }
});

exports.getSingleTag = asyncHandler(async (req, res) => {
  try {
    await tagsService.retrieveOne(req.params.tagname, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(err.code)
          .json(err);
      }
      return res.status(data.code)
        .json(data);
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseHandler(false, 500, 'Server Error', null));
  }
});

exports.createTag = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .json({ errors: errors.array() });
  }
  try {
    const tag = new Tag({
      tagname: req.body.tagname,
      description: req.body.description,
    });
    await tagsService.create(tag, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(err.code)
          .json(err);
      }
      return res.status(data.code)
        .json(data);
    });
  } catch (err) {
    console.log(err);
    return res.status(500)
      .json(responseHandler(false, 500, 'Server Error', null));
  }
});
