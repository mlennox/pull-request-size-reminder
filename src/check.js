const exec = require('child_process').exec;
const limitDetails = require('./limitDetails');

const matcher = new RegExp(/(\d*) file.? changed/);
const gitHasRemote = 'git remote -v';
const gitDiffCommand = 'git --no-pager diff --cached --stat $(git merge-base FETCH_HEAD origin)';

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve({ stdout, stderr });
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

async function git_checkInitialisedAndRemoted() {
  try {
    const { stderr, stdout } = await runCommand(gitHasRemote).catch(() => {
      return { stderr: 'The repo has not been initialised' };
    });
    return !stdout || stderr ? false : true;
  } catch (error) {
    return false;
  }
}

async function git_diffSummary() {
  try {
    return await runCommand(gitDiffCommand);
  } catch (error) {
    process.exit(1);
  }
}

async function check() {
  const isGit = await git_checkInitialisedAndRemoted();
  if (isGit) {
    const { stderr, stdout } = await git_diffSummary();
    if (stderr) {
      console.error('There was an error fetching the summary of the difference between your branch and origin');
    }
    generateStagedFileCountMessage(stdout);
  } else {
    console.log('This is not a git repo or has no origin');
  }
}

if (!module.parent) {
  check();
}

module.exports = {
  check,
  git_diffSummary,
  git_checkInitialisedAndRemoted,
  runCommand,
  generateStagedFileCountMessage,
  generateMessage,
  parseNumberOfFiles,
  findRelevantMessageDetails,
};
