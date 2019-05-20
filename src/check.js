#! /usr/bin/env node
const exe = require('child_process').exec;
const limitDetails = require('./limitDetails');

const matcher = new RegExp(/(\d*) file.? changed/);
// FETCH_HEAD only works if you are on a branch that you have pushed
const gitDiffCommand = 'git --no-pager diff --stat $(git merge-base FETCH_HEAD origin master)';

function parseNumberOfFiles(output) {
  const match = output.match(matcher);
  return match && match.length > 1 ? match[1] : 0;
};

function generateMessage(numberOfFiles) {
  let previous = 0;
  const details = limitDetails.find(detail => {
    const isMatch = numberOfFiles >= previous && (!detail.maxNumber || numberOfFiles < detail.maxNumber);
    previous = detail.maxNumber;
    return isMatch;
  });

  return details.colour(`\n\n ${details.title}  \n Your branch has changed ${numberOfFiles} file${numberOfFiles > 1 ? 's' : ''} \n ${details.message} \n\n`);
};

function handleGitResponse(err, stdout) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  const numberOfFiles = 41; //parseNumberOfFiles(stdout);
  if (numberOfFiles > 0) {
    console.log(generateMessage(numberOfFiles));
  }
}


exe(gitDiffCommand, handleGitResponse);
