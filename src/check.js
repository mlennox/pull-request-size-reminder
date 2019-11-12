// const git = require('./git');
const limitDetails = require('./limitDetails');
const exec = require('child_process').exec;
// const chalk = require('chalk');

const matcher = new RegExp(/(\d*) file.? changed/);
const gitHasRemote = 'git remote -v';
const gitDiffCommand = 'git --no-pager diff --cached --stat $(git merge-base FETCH_HEAD origin)';

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (stderr, stdout) => {
      if (stderr) {
        reject(stderr);
        // console.error(err);
        // process.exit(1);
      }

      resolve(stdout);

      // const numberOfFiles = parseNumberOfFiles(stdout);
      // if (numberOfFiles > 0) {
      //   const message = generateMessage(numberOfFiles);
      //   console.log(message.colour(message.text));
      // }
    });
  });
}

function parseNumberOfFiles(output) {
  const match = (output || '').match(matcher);
  return match && match.length > 1 ? parseInt(match[1]) : 0;
}

function generateMessage(numberOfFiles) {
  const details = findRelevantMessageDetails(numberOfFiles);

  return {
    colour: details.colour,
    text: `

 ${details.title} 
 Your branch has changed ${numberOfFiles} file${numberOfFiles > 1 ? 's' : ''} 
 ${details.message}

`,
  };
}

function findRelevantMessageDetails(numberOfFiles) {
  let previous = 0;
  return limitDetails.find(detail => {
    const isMatch = numberOfFiles >= previous && (!detail.maxNumber || numberOfFiles < detail.maxNumber);
    previous = detail.maxNumber;
    return isMatch;
  });
}

function generateStagedFileCountMessage(stdout) {
  const numberOfFiles = parseNumberOfFiles(stdout);
  if (numberOfFiles > 0) {
    const message = generateMessage(numberOfFiles);
    console.log(message.colour(message.text));
  }
}

// check git remote exists
//

async function git_checkInitialisedAndRemoted() {
  try {
    const { stderr } = await runCommand(gitHasRemote);
    // if we get an error then we assume there is either no local repo or it has not origin
    // in which case we have no work to do
    return stderr ? false : true;
  } catch (error) {
    console.log('This is not a git repo');
    return false;
  }
}

async function git_diffSummary() {
  try {
    return await runCommand(gitDiffCommand);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

async function check() {
  const isGitified = await git_checkInitialisedAndRemoted();
  if (isGitified) {
    const headDiff = git_diffSummary();
    generateStagedFileCountMessage(headDiff);
  }
}

if (!module.parent) {
  check();
}

module.exports = {
  check,
  generateStagedFileCountMessage,
  generateMessage,
  parseNumberOfFiles,
  findRelevantMessageDetails,
};
