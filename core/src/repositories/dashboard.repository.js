const Sequelize = require('sequelize');

const {
  responseHandler,
} = require('../helpers');
const {
  UsersModelSequelize,
} = require('../models');

exports.questionPerDay = async (result) => {
  const queryResult = await UsersModelSequelize.query(
    'select created_at, count(id) from posts WHERE created_at >= dateadd(day,datediff(day,0,GetDate())- 7,0) GROUP BY created_at',
  )
    .catch((error) => {
      console.log(error);
      return result(responseHandler(false, 500, 'Something went wrong!', null), null);
    });

  console.log(queryResult);
};
