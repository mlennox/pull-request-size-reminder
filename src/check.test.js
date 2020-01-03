import {
  findRelevantMessageDetails,
  generateMessage,
  generateStagedFileCountMessage,
  parseNumberOfFiles,
  git_diffSummary,
  git_checkInitialisedAndRemoted,
  limitDetails,
} from './check';
import { exec } from 'child_process';

jest.mock('child_process', () => {
  return {
    exec: jest.fn(),
  };
});

describe('check', () => {
  let exitSpy;
  beforeAll(() => {
    exitSpy = jest.spyOn(process, 'exit');
  });
  beforeEach(() => {
    exec.mockReset();
    process.exit.mockReset();
  });
  describe('git_checkInitialisedAndRemoted', () => {
    it('directory is not a repo or has no remote', () => {
      exec.mockImplementation(() => new Promise.resolve({ stderr: 'some error' }));

      git_checkInitialisedAndRemoted();

      expect(exec).toHaveBeenCalledTimes(1);
    });

    it('checking git remote throws an error', () => {
      exec.mockImplementation(() => Promise.reject('some error'));

      git_checkInitialisedAndRemoted();

      expect(exec).toHaveBeenCalledTimes(1);
    });

    it('the repo is initialised and has a remote', () => {
      exec.mockImplementation(
        () =>
          new Promise.resolve({
            stdout: `origin	git@github.com:mlennox/pull-request-size-reminder.git (fetch)
origin	git@github.com:mlennox/pull-request-size-reminder.git (push)`,
          })
      );

      git_checkInitialisedAndRemoted();

      expect(exec).toHaveBeenCalledTimes(1);
    });
  });

  describe('git_diffSummary', () => {
    it('git command throws an error, process will exit', async () => {
      exec.mockImplementation(() => {
        throw new Error('some error');
      });

      await git_diffSummary().catch(() => {
        expect(exitSpy).toHaveBeenCalledWith(1);
      });
    });

    it('git command called as expected', () => {
      git_diffSummary();

      expect(exec).toHaveBeenCalledWith(
        `git --no-pager diff --cached --stat $(git merge-base FETCH_HEAD origin)`,
        expect.anything()
      );
    });
  });

  describe('parseNumberOfFiles', () => {
    it('empty string returns 0 matched files', () => {
      const result = parseNumberOfFiles();
      expect(result).toEqual(0);
    });
    it('git diff with no matching string returns 0 matched files', () => {
      const result = parseNumberOfFiles('Fill the lung that loves the phosphorescent absorbent time spent on few');
      expect(result).toEqual(0);
    });
    it('git diff with changed files returns number of files', () => {
      const result = parseNumberOfFiles('1 file changed');
      expect(result).toEqual(1);
    });
  });

  describe('findRelevantMessageDetails', () => {
    it('if numberOfFiles less than 15, matches good message', () => {
      const expected = limitDetails[0];
      const result = findRelevantMessageDetails(5);
      expect(result).toEqual(expected);
    });

    it('if numberOfFiles greater than 40, matches very large message', () => {
      const expected = limitDetails[3];
      const result = findRelevantMessageDetails(45);

      expect(result).toEqual(expected);
    });
  });

  describe('generateMessage', () => {
    it('with 3 files changed', () => {
      const expected = `

 Great! 
 Your branch has changed 3 files 
 Good job! your pull request will be easy to review

`;
      const result = generateMessage(3);
      expect(result.text).toEqual(expected);
    });
  });

  describe('generateStagedFileCountMessage', () => {
    test('if files have changed will log a message', () => {
      const diff = '1 file changed';
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {
        // lint won't allow empty curlies...
      });
      generateStagedFileCountMessage(diff);
      expect(consoleMock).toHaveBeenCalledTimes(1);
    });
  });
});
