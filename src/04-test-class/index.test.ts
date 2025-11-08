import {
  BankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from './index';

describe('BankAccount', () => {
  let accountWithBalance: BankAccount;
  let accountWithoutBalance: BankAccount;

  beforeEach(() => {
    accountWithBalance = new BankAccount(100);
    accountWithoutBalance = new BankAccount(50);
  });

  test('should create account with initial balance', () => {
    expect(accountWithBalance.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const withdrawAmount = accountWithBalance.getBalance() + 1;
    expect(() => accountWithBalance.withdraw(withdrawAmount)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const transferAmount = 200;
    expect(() =>
      accountWithBalance.transfer(transferAmount, accountWithoutBalance),
    ).toThrowError(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const transferToSameAccount = () =>
      accountWithBalance.transfer(50, accountWithBalance);
    expect(transferToSameAccount).toThrowError(TransferFailedError);
  });

  test('should deposit money', () => {
    const depositAmount = 50;
    accountWithBalance.deposit(depositAmount);
    expect(accountWithBalance.getBalance()).toBe(100 + depositAmount);
  });

  test('should withdraw money', () => {
    const withdrawAmount = 50;
    accountWithBalance.withdraw(withdrawAmount);
    expect(accountWithBalance.getBalance()).toBe(100 - withdrawAmount);
  });

  test('should transfer money', () => {
    const transferAmount = 50;
    accountWithBalance.transfer(transferAmount, accountWithoutBalance);
    expect(accountWithBalance.getBalance()).toBe(100 - transferAmount);
    expect(accountWithoutBalance.getBalance()).toBe(50 + transferAmount);
  });

  test('fetchBalance should return number in case if request did not fail', async () => {
    const balance = await accountWithBalance.fetchBalance();
    expect(typeof balance === 'number' || balance === null).toBe(true);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const newBalance = 200;
    jest
      .spyOn(accountWithBalance, 'fetchBalance')
      .mockResolvedValueOnce(newBalance);
    await accountWithBalance.synchronizeBalance();
    expect(accountWithBalance.getBalance()).toBe(newBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(accountWithBalance, 'fetchBalance').mockResolvedValueOnce(null);
    await expect(accountWithBalance.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
  });
});
