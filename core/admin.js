const { usersRepository } = require('./src/repositories');

const args = process.argv;

if (args.length === 2) {
  console.log('Provide username in command line');
} else {
  console.log(usersRepository.set_admin(args[2]));
}
