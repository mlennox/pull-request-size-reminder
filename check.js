#! /usr/bin/env node
const limits = { risky: 15, toobig: 25, insane: 40 };
const messages = {
  acceptable: 'Good job! your pull request will be easy to review',
  risky:
    'Ok. Your pull request is getting a litle bit on the large side, keep an eye on it',
  toobig:
    'Woah! Your pull request is large, you may have your work cut out convincing folks to review it!',
  insane: 'INSANITY! The number of files is too damn high!',
};

const matcher = new RegExp(/(\d*) files changed/);

const exe = require('child_process').exec;
const chalk = require('chalk');

exe(
  'git --no-pager diff --stat $(git merge-base FETCH_HEAD origin master)',
  (err, stdout) => {
    const numberOfFiles = parseNumberOfFiles(stdout);
    if (numberOfFiles > 0) {
      console.log(
        mapSizeToColour(
          numberOfFiles,
          `\nYour branch has changed ${numberOfFiles} files\n\n${mapSizeToMessage(
            numberOfFiles
          )}\n`
        )
      );
    }
  }
);

const parseNumberOfFiles = output => {
  const match = output.match(matcher);
  console.log(output, match)
  return match && match.length > 1 ? match[1] : 0;
};

const mapSizeToMessage = numberOfFiles => {
  if (numberOfFiles <= limits.risky) {
    return messages.acceptable;
  } else if (numberOfFiles <= limits.toobig) {
    return messages.risky;
  } else if (numberOfFiles <= limits.insane) {
    return messages.toobig;
  }
  return messages.insane;
};

const mapSizeToColour = (numberOfFiles, message) => {
  if (numberOfFiles <= limits.risky) {
    return chalk.bgGreen.black(message);
  } else if (numberOfFiles <= limits.toobig) {
    return chalk.bgYellow.red(message);
  } else if (numberOfFiles <= limits.insane) {
    return chalk.bgRed.yellow(message);
  }
  // too big!
  return chalk.bgMagenta.white.bold(message);
};