import { findRelevantMessageDetails, generateMessage, handleGitResponse, parseNumberOfFiles } from './check';
import limitDetails from './limitDetails';

jest.mock('child_process', () => {
  return {
    exec: () => {},
  };
});

describe('check', () => {
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

  describe('handleGitResponse', () => {
    test('error generates exit 1', () => {
      const processMock = jest.spyOn(process, 'exit').mockImplementation(() => {});
      handleGitResponse('some error code', null);
      expect(processMock).toHaveBeenCalledWith(1);
    });

    test('if files have changed will log a message', () => {
      const expected = '';
      const diff = '1 file changed';
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
      handleGitResponse(null, diff);
      expect(consoleMock).toHaveBeenCalledTimes(1);
    });
  });
});
