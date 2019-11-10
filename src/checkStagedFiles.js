#! /usr/bin/env node
const git = require('./git');
const limitDetails = require('./limitDetails');

const matcher = new RegExp(/(\d*) file.? changed/);
// const gitDiffCommand = 'git --no-pager diff --cached --stat $(git merge-base FETCH_HEAD origin)';

function parseNumberOfFiles(output) {
  const match = (output || '').match(matcher);
  return match && match.length > 1 ? parseInt(match[1]) : 0;
}

function findRelevantMessageDetails(numberOfFiles) {
  let previous = 0;
  return limitDetails.find(detail => {
    const isMatch = numberOfFiles >= previous && (!detail.maxNumber || numberOfFiles < detail.maxNumber);
    previous = detail.maxNumber;
    return isMatch;
  });
}

function generateMessage(numberOfFiles) {
  const details = findRelevantMessageDetails(numberOfFiles);

  return {
    colour: details.colour,
    text: `\n\n ${details.title} \n Your branch has changed ${numberOfFiles} file${numberOfFiles > 1 ? 's' : ''} \n ${
      details.message
    } \n\n`,
  };
}

function generateStagedFileCountMessage(stdout) {
  const numberOfFiles = parseNumberOfFiles(stdout);
  if (numberOfFiles > 0) {
    const message = generateMessage(numberOfFiles);
    console.log(message.colour(message.text));
  }
}

async function findStagedFileCount() {
  try {
    const sha = await git(['merge-base', 'HEAD', 'origin']);
    const result = await git(['--no-pager', 'diff', '--cached', '--stat', sha]);
    generateStagedFileCountMessage(result);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = {
  findStagedFileCount,
  generateStagedFileCountMessage,
  generateMessage,
  parseNumberOfFiles,
  findRelevantMessageDetails,
};
