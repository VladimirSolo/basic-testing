import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const spy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, 2000);

    expect(spy).toHaveBeenCalledWith(callback, 2000);

    spy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);

    jest.advanceTimersByTime(999);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const spy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, 500);

    expect(spy).toHaveBeenCalledWith(callback, 500);

    spy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);

    jest.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockedJoin = join as jest.Mock;
  const mockedExistsSync = existsSync as jest.Mock;
  const mockedReadFile = readFile as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    mockedJoin.mockReturnValue('/full/path/to/file');
    mockedExistsSync.mockReturnValue(false);

    await readFileAsynchronously('myFile.txt');
    expect(mockedJoin).toHaveBeenCalledWith(__dirname, 'myFile.txt');
  });

  test('should return null if file does not exist', async () => {
    mockedJoin.mockReturnValue('/full/path/to/file');
    mockedExistsSync.mockReturnValue(false);

    const result = await readFileAsynchronously('missing.txt');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    mockedJoin.mockReturnValue('/full/path/to/file');
    mockedExistsSync.mockReturnValue(true);
    mockedReadFile.mockResolvedValue(Buffer.from('Hello world!'));

    const result = await readFileAsynchronously('file.txt');
    expect(mockedReadFile).toHaveBeenCalledWith('/full/path/to/file');
    expect(result).toBe('Hello world!');
  });
});
