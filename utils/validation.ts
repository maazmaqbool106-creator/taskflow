export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  message: string;
}

export function validatePassword(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  // Matches any character that is NOT a lowercase letter, uppercase letter, or digit.
  // This covers standard symbols like !@#$%^&*()_+ etc.
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

  let message = "";
  if (!isValid) {
    const missing: string[] = [];
    if (!hasMinLength) missing.push("8+ characters");
    if (!hasUppercase) missing.push("1 uppercase letter");
    if (!hasLowercase) missing.push("1 lowercase letter");
    if (!hasNumber) missing.push("1 number");
    if (!hasSpecialChar) missing.push("1 special character");
    message = `Password needs: ${missing.join(", ")}.`;
  }

  return {
    isValid,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    message,
  };
}
