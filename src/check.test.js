import {
  findRelevantMessageDetails,
  generateMessage,
  generateStagedFileCountMessage,
  parseNumberOfFiles,
  findStagedFileCount,
} from './checkStagedFiles';
import limitDetails from './limitDetails';
import git from './git';

jest.mock('./git', () =>
  jest.fn().mockResolvedValue(`package-lock.json | 12 +++++++++---
package.json      |  3 ++-
src/check.js      | 11 ++++++++---
3 files changed, 19 insertions(+), 7 deletions(-)`)
);

describe('check', () => {
  describe('findStagedFileCount', () => {
    it('git command called twice', async () => {
      await findStagedFileCount();
      expect(git).toHaveBeenCalledTimes(2);
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
      const result = generateMessage(3);
      expect(result.text).toEqual(
        `\n\n Great! \n Your branch has changed 3 files \n Good job! your pull request will be easy to review \n\n`
      );
    });
  });

  describe('generateStagedFileCountMessage', () => {
    test('if files have changed will log a message', () => {
      const expected = '';
      const diff = '1 file changed';
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
      generateStagedFileCountMessage(diff);
      expect(consoleMock).toHaveBeenCalledTimes(1);
    });
  });
});
