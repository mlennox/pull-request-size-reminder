// TODO : allow this be overriden in part or whole by config
// this is in order, no need to sort, and if we use config we can sort when loaded

const chalk = require('chalk');

module.exports = [
  {
    maxNumber: 15,
    title: 'Great!',
    message: 'Good job! your pull request will be easy to review',
    colour: chalk.whiteBright.bgGreen.bold,
  },
  {
    maxNumber: 25,
    title: 'Careful!',
    message: 'Your pull request is getting a little bit on the large side, keep an eye on it',
    colour: chalk.redBright.bgYellowBright,
  },
  {
    maxNumber: 40,
    title: 'Woah! A big PR!',
    message: 'Your pull request is large, think of your colleagues!',
    colour: chalk.whiteBright.bgRedBright.bold,
  },
  {
    title: 'Very large PR!',
    message: 'The number of files is too damn high!',
    colour: chalk.yellowBright.bgMagenta.bold,
  },
];
