import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({ push: mockedHistoryPush }),
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({ signIn: mockedSignIn }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const userNameField = getByPlaceholderText('Username');
    const passwordField = getByPlaceholderText('Password');
    const buttonElement = getByText('Login');

    fireEvent.change(userNameField, {
      target: { value: 'eb@emotion-banking.at' },
    });
    fireEvent.change(passwordField, {
      target: { value: '123456' },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/projects');
    });
  });

  it('should not be able to sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const userNameField = getByPlaceholderText('Username');
    const passwordField = getByPlaceholderText('Password');
    const buttonElement = getByText('Login');

    fireEvent.change(userNameField, {
      target: { value: 'not-valid-email' },
    });
    fireEvent.change(passwordField, {
      target: { value: '123456' },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display an error if login fails', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const userNameField = getByPlaceholderText('Username');
    const passwordField = getByPlaceholderText('Password');
    const buttonElement = getByText('Login');

    fireEvent.change(userNameField, {
      target: { value: 'eb@emotion-banking.at' },
    });
    fireEvent.change(passwordField, {
      target: { value: '123456' },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });
});
