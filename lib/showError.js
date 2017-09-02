const chalk = require('chalk')

module.exports = function (message) {
  console.log(chalk.red.bold(message))
  process.exit(1)
}