const {
  responseHandler,
  asyncHandler,
} = require('../helpers');
const { dashboardService } = require('../services');

exports.questionPerDay = asyncHandler(async (req, res) => {
  try {

    await dashboardService.questionPerDay(
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(err.code)
            .json(err);
        }
        return res.status(data.code)
          .json(data);
      },
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(responseHandler(false, 500, 'Server Error', null));
  }
});
