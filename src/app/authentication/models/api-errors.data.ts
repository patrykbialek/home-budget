
export class ApiErrors {
  static Parse(errorCode: string): string {

    let message: string;

    switch (errorCode) {
      case 'auth/wrong-password':
        message = 'E-mail i/lub hasło nieprawidłowe.';
        break;
      case 'auth/network-request-failed':
        message = 'Please check your internet connection';
        break;
      case 'auth/too-many-requests':
        message = 'We have detected too many requests from your device. Take a break please!';
        break;
      case 'auth/user-disabled':
        message = 'Your account has been disabled or deleted. Please contact the system administrator.';
        break;
      case 'auth/requires-recent-login':
        message = 'Please login again and try again!';
        break;
      case 'auth/email-already-exists':
        message = 'E-mail jest już zajęty.';
        break;
      case 'auth/user-not-found':
        message = 'E-mail nieprawidłowy. Sprawdź i spróbuje ponownie.';
        break;
      case 'auth/phone-number-already-exists':
        message = 'The phone number is already in use by an existing user.';
        break;
      case 'auth/invalid-phone-number':
        message = 'The phone number is not a valid phone number!';
        break;
      case 'auth/invalid-email  ':
        message = 'The email address is not a valid email address!';
        break;
      case 'auth/cannot-delete-own-user-account':
        message = 'You cannot delete your own user account.';
        break;
      case 'auth/invalid-action-code':
        message = 'Token nieprawidłowy, wygasł lub został już wykorzystany.';
        break;
      case 'auth/weak-password':
        message = 'Hasło musi się składać z co najmniej 6 znaków.';
        break;
      case 'auth/invalid-email':
        message = 'Nieprawidłowy format adresu e-mail.';
        break;
      case 'auth/email-already-in-use':
        message = 'Adres e-mail zajęty.';
        break;
      default:
        message = 'Oops! Something went wrong. Try again later.';
        break;
    }

    return message;
  }
}
