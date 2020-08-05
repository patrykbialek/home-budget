import { ApiErrors } from './api-errors.data';

fdescribe('ApiErrors', () => {
  const errorClass = ApiErrors;

  const messages = [
    {
      code: 'auth/wrong-password',
      message: 'E-mail i/lub hasło nieprawidłowe.',
    },
    {
      code: 'auth/network-request-failed',
      message: 'Please check your internet connection',
    },
    {
      code: 'auth/too-many-requests',
      message: 'We have detected too many requests from your device. Take a break please!',
    },
    {
      code: 'auth/user-disabled',
      message: 'Your account has been disabled or deleted. Please contact the system administrator.',
    },
    {
      code: 'auth/requires-recent-login',
      message: 'Please login again and try again!',
    },
    {
      code: 'auth/email-already-exists',
      message: 'E-mail jest już zajęty.',
    },
    {
      code: 'auth/user-not-found',
      message: 'E-mail nieprawidłowy. Sprawdź i spróbuje ponownie.',
    },
    {
      code: 'auth/phone-number-already-exists',
      message: 'The phone number is already in use by an existing user.',
    },
    {
      code: 'auth/invalid-phone-number',
      message: 'The phone number is not a valid phone number!',
    },
    {
      code: 'auth/invalid-email  ',
      message: 'The email address is not a valid email address!',
    },
    {
      code: 'auth/cannot-delete-own-user-account',
      message: 'You cannot delete your own user account.',
    },
    {
      code: 'auth/invalid-action-code',
      message: 'Token nieprawidłowy, wygasł lub został już wykorzystany.',
    },
    {
      code: 'auth/weak-password',
      message: 'Hasło musi się składać z co najmniej 6 znaków.',
    },
    {
      code: 'auth/invalid-email',
      message: 'Nieprawidłowy format adresu e-mail.',
    },
    {
      code: 'auth/email-already-in-use',
      message: 'Adres e-mail zajęty.',
    }
  ];

  messages.forEach(message => {
    it(`should get message for ${message.code}`, () => {
      expect(errorClass.Parse(message.code))
        .toBe(message.message);
    });
  });

});
