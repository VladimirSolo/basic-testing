import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  return {
    ...jest.requireActual<typeof import('./index')>('./index'),
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    expect(mockOne).not.toHaveBeenCalled();
    expect(mockTwo).not.toHaveBeenCalled();
    expect(mockThree).not.toHaveBeenCalled();
  });

  test('unmockedFunction should log into console', () => {
    const logger = jest.spyOn(console, 'log');
    unmockedFunction();
    expect(logger).toHaveBeenCalledWith('I am not mocked');
    logger.mockRestore();
  });
});
