import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const result = generateLinkedList([1, 2, 3]);

    const expected = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };

    expect(result).toStrictEqual(expected);
  });

  test('should generate linked list from values 2', () => {
    const result = generateLinkedList(['a', 'b', 'c']);
    expect(result).toMatchSnapshot();
  });

  test('should handle empty array', () => {
    const result = generateLinkedList([]);
    expect(result).toStrictEqual({ value: null, next: null });
  });

  test('should handle single element', () => {
    const result = generateLinkedList([42]);
    expect(result).toStrictEqual({
      value: 42,
      next: { value: null, next: null },
    });
  });

  test('should work with different types', () => {
    const result = generateLinkedList([{ id: 1 }, { id: 2 }]);
    expect(result).toStrictEqual({
      value: { id: 1 },
      next: {
        value: { id: 2 },
        next: { value: null, next: null },
      },
    });
  });
});
