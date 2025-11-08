import axios from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  let mockGet: jest.Mock;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    throttledGetDataFromApi.cancel();

    jest.useFakeTimers();

    mockGet = jest.fn();
    mockCreate = jest.fn().mockReturnValue({
      get: mockGet,
    });
    mockedAxios.create = mockCreate;
  });

  afterEach(() => {
    throttledGetDataFromApi.cancel();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const mockData = { id: 1, title: 'Test' };
    mockGet.mockResolvedValue({ data: mockData });

    const promise = throttledGetDataFromApi('/posts/1');

    await Promise.resolve();

    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });

    await promise;
  });

  test('should perform request to correct provided url', async () => {
    const mockData = { id: 1, title: 'Test' };
    mockGet.mockResolvedValue({ data: mockData });

    const relativePath = '/posts/1';
    const promise = throttledGetDataFromApi(relativePath);

    await Promise.resolve();

    expect(mockGet).toHaveBeenCalledWith(relativePath);

    await promise;
  });

  test('should return response data', async () => {
    const mockData = { id: 1, title: 'Test Post', userId: 1 };
    mockGet.mockResolvedValue({ data: mockData });

    const promise = throttledGetDataFromApi('/posts/1');

    await Promise.resolve();

    const result = await promise;

    expect(result).toEqual(mockData);
  });

  test('should throttle multiple calls within throttle time', async () => {
    const mockData1 = { id: 1, title: 'First' };
    const mockData2 = { id: 2, title: 'Second' };

    mockGet
      .mockResolvedValueOnce({ data: mockData1 })
      .mockResolvedValueOnce({ data: mockData2 });

    const promise1 = throttledGetDataFromApi('/posts/1');
    await Promise.resolve();
    const result1 = await promise1;

    const promise2 = throttledGetDataFromApi('/posts/2');
    const result2 = await promise2;

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(result1).toEqual(mockData1);
    expect(result2).toEqual(mockData1);
  });

  test('should allow new call after throttle time expires', async () => {
    const mockData1 = { id: 1, title: 'First' };
    const mockData2 = { id: 2, title: 'Second' };

    mockGet
      .mockResolvedValueOnce({ data: mockData1 })
      .mockResolvedValueOnce({ data: mockData2 });

    const promise1 = throttledGetDataFromApi('/posts/1');
    await Promise.resolve();
    await promise1;

    jest.advanceTimersByTime(THROTTLE_TIME + 1);

    const promise2 = throttledGetDataFromApi('/posts/2');
    await Promise.resolve();
    await promise2;

    expect(mockGet).toHaveBeenCalledTimes(2);
    expect(mockGet).toHaveBeenNthCalledWith(1, '/posts/1');
    expect(mockGet).toHaveBeenNthCalledWith(2, '/posts/2');
  });
});
