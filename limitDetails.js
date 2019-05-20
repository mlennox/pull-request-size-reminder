// TODO : allow this be overriden in part or whole by config
// this is in order, no need to sort, and if we use config we can sort when loaded

const chalk = require('chalk');

module.exports = [
  {
    maxNumber: 15,
    title: 'Great!',
    message: 'Good job! your pull request will be easy to review',
    colour: chalk.black.bgGreen.bold,
  },
  {
    maxNumber: 25,
    title: 'Careful!',
    message: 'Your pull request is getting a little bit on the large side, keep an eye on it',
    colour: chalk.red.bgYellow,
  },
  {
    maxNumber: 40,
    title: 'A big PR!',
    message: 'Woah! Your pull request is large, you may have your work cut out convincing folks to review it!',
    colour: chalk.white.bgRed.bold
  },
  {
    title: 'Very large PR!',
    message: 'The number of files is too damn high!',
    colour: chalk.blue.bgMagenta.bold
  }
]