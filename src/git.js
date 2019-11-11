const execa = require('execa');

module.exports = async function git(cmd, options = {}) {
  const { stdout } = await execa('git', [].concat(cmd), {
    ...options,
    cwd: options.cwd || process.cwd(),
  });
  return stdout;
};
