import { findRelevantMessageDetails, generateMessage, handleGitResponse, parseNumberOfFiles } from './check';

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
    it('git diff with no matching string returns 0 matched files', () => {});
    it('git diff with changed files returns number of files', () => {});
  });

  describe('findRelevantMessageDetails', () => {});

  describe('generateMessage', () => {});

  describe('handleGitResponse', () => {});
});
