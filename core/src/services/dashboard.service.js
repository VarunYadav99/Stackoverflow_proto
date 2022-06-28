const { dashboardRepository } = require('../repositories');

exports.questionPerDay = (newUser, result) => dashboardRepository.register(newUser, result);
