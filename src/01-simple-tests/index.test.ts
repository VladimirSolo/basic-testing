// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  const inputNumbers = { a: 40, b: 2 };

  test('should add two numbers', () => {
    const add = simpleCalculator({ ...inputNumbers, action: Action.Add });
    expect(add).toBe(42);
  });

  test('should subtract two numbers', () => {
    const subtract = simpleCalculator({
      ...inputNumbers,
      action: Action.Subtract,
    });
    expect(subtract).toBe(38);
  });

  test('should multiply two numbers', () => {
    const multiply = simpleCalculator({
      ...inputNumbers,
      action: Action.Multiply,
    });
    expect(multiply).toBe(80);
  });

  test('should divide two numbers', () => {
    const divide = simpleCalculator({
      ...inputNumbers,
      action: Action.Divide,
    });
    expect(divide).toBe(20);
  });

  test('should exponentiate two numbers', () => {
    const exponentiate = simpleCalculator({
      ...inputNumbers,
      action: Action.Exponentiate,
    });
    expect(exponentiate).toBe(1600);
  });

  test('should return null for invalid action', () => {
    const invalidAction = simpleCalculator({
      ...inputNumbers,
      action: 'invalidAction',
    });
    expect(invalidAction).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const invalidArgs = simpleCalculator({
      a: 'invalid',
      b: 42,
      action: Action.Add,
    });
    expect(invalidArgs).toBeNull();
  });
});
