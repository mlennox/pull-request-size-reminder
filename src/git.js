const execa = require('execa');

module.exports = async function git(cmd, options = []) {
  const optionsObject = options.reduce((acc, option) => {
    acc[option] = null;
    return acc;
  }, {});
  const { stdout } = await execa('git', [].concat(cmd), {
    ...optionsObject,
    cwd: optionsObject.cwd || process.cwd(),
  });
  return stdout;
};
