export function isPasswordValid(password: string): boolean {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const conditionsMet =
    [hasLetter, hasNumber, hasSpecialChar].filter(Boolean).length >= 2;
  return conditionsMet;
}

export function isEmailValid(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isEmail(account: string): boolean {
  if (account.includes("@")) {
    return true;
  } else {
    return false;
  }
}

export function isPhone(account: string): boolean {
  if (account.length == 11) {
    return true;
  } else {
    return false;
  }
}
