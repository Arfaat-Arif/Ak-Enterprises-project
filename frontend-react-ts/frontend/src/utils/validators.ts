const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};
  if (!isRequired(values.name)) errors.name = 'Please enter your name.';
  if (!isRequired(values.email)) {
    errors.email = 'Please enter your email.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!isRequired(values.message)) errors.message = 'Please enter a message.';
  return errors;
}
