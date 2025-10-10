/* eslint-env jest */

import { validateUpload } from '@/common';

jest.mock('@/i18n', () => ({
  i18n: {
    t: message => message
  }
}));

describe('validation.js', () => {
  describe('validateUpload fn', () => {
    it('should return an error message if max file exceeded', () => {
      const mockInput = {
        files: ['file1', 'file2', 'file3', 'file4', 'file5'],
        uploadRequest: {
          usedSpace: 5000,
          maxFileCount: 5,
          maxFileSize: 100,
          maxDepositSize: 10000,
          currentFiles: ['file6', 'file7']
        },
      };

      expect(validateUpload(mockInput.files, mockInput.uploadRequest)).toMatch('MESSAGE.ERROR_MAX_FILE_COUNT_EXCEEDED');
    });

    it('should return an error message if the size limit of a file is violated', () => {
      const mockInput = {
        files: [{
          name: 'file1',
          size: 50
        }, {
          name: 'file2',
          size: 120
        }],
        uploadRequest: {
          usedSpace: 5000,
          maxFileCount: 5,
          maxFileSize: 100,
          maxDepositSize: 10000,
          currentFiles: []
        },
      };

      expect(validateUpload(mockInput.files, mockInput.uploadRequest)).toMatch('MESSAGE.ERROR_FILE_SIZE_EXCEEDED');
    });

    it('should return an error message if there is not enough space left', () => {
      const mockInput = {
        files: [{
          name: 'file1',
          size: 50
        }, {
          name: 'file2',
          size: 120
        }, {
          name: 'file3',
          size: 150
        }],
        uploadRequest: {
          usedSpace: 9700,
          maxFileCount: 5,
          maxFileSize: 500,
          maxDepositSize: 10000,
          currentFiles: []
        },
      };

      expect(validateUpload(mockInput.files, mockInput.uploadRequest)).toMatch('MESSAGE.ERROR_NOT_ENOUGH_SPACE');
    });

    it('should not return an error message if there is no limit for maxFileCount and other criterias are met', () => {
      const mockInput = {
        files: [{
          name: 'file1',
          size: 50
        }, {
          name: 'file2',
          size: 120
        }, {
          name: 'file3',
          size: 150
        }],
        uploadRequest: {
          usedSpace: 0,
          maxFileCount: -1,
          maxFileSize: 500,
          maxDepositSize: 10000,
          currentFiles: []
        },
      };

      expect(validateUpload(mockInput.files, mockInput.uploadRequest)).toBeUndefined();
    });

    it('should not return an error message if there is no limit for max size of a file and other criterias are met', () => {
      const mockInput = {
        files: [{
          name: 'file1',
          size: 3500
        }, {
          name: 'file2',
          size: 3000
        }, {
          name: 'file3',
          size: 3000
        }],
        uploadRequest: {
          usedSpace: 0,
          maxFileCount: 3,
          maxDepositSize: 10000,
          currentFiles: []
        },
      };

      expect(validateUpload(mockInput.files, mockInput.uploadRequest)).toBeUndefined();
    });

    it('should not return an error message if there is no limit for max deposit and other criterias are met', () => {
      const mockInput = {
        files: [{
          name: 'file1',
          size: 3500
        }, {
          name: 'file2',
          size: 3000
        }, {
          name: 'file3',
          size: 3000
        }],
        uploadRequest: {
          usedSpace: 0,
          maxFileCount: 3,
          maxFileSize: 5000,
          maxDepositSize: 0,
          currentFiles: []
        },
      };

      expect(validateUpload(mockInput.files, mockInput.uploadRequest)).toBeUndefined();
    });
  });
});