const { responseHandler } = require('../helpers');
const { TagsModelSequelize } = require('../models');

const checkTagExistence = async (req, res, next) => {
  const { tagname } = req.body;
  const user = await TagsModelSequelize
    .findOne({ where: { tagname } })
    .catch((error) => {
      console.log(error.message);
      return res
        .status(error.statusCode)
        .json(responseHandler(false, error.statusCode, 'Some error occurred while creating tag.', null));
    });

  if (user !== null) {
    return res
      .status(400)
      .json(responseHandler(false, 400, 'Tag already exists', null));
  }
  next();
};

module.exports = checkTagExistence;
