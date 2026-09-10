/**
 * Centralized Input Validation Utilities for Wildking Jeep Safari
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates an email address.
 */
export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) {
    return 'Email address is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address (e.g., user@example.com).';
  }
  return null;
}

/**
 * Validates password strength.
 */
export function validatePassword(password: string, minLength: number = 6): string | null {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long.`;
  }
  return null;
}

/**
 * Validates confirm password match.
 */
export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) {
    return 'Confirm password is required.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
}

/**
 * Validates a person's full name.
 */
export function validateName(name: string): string | null {
  if (!name || !name.trim()) {
    return 'Full name is required.';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long.';
  }
  return null;
}

/**
 * Validates a phone number.
 */
export function validatePhone(phone: string): string | null {
  if (!phone || !phone.trim()) {
    return 'Phone number is required.';
  }
  const phoneDigits = phone.replace(/[\s\-\+\(\)]/g, '');
  if (phoneDigits.length < 7 || phoneDigits.length > 15 || isNaN(Number(phoneDigits))) {
    return 'Please enter a valid phone number (7-15 digits).';
  }
  return null;
}

/**
 * Helper to get tomorrow's date formatted as YYYY-MM-DD in local time
 */
export function getTomorrowDateString(): string {
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Validates expedition booking date (must be a future date starting from tomorrow).
 */
export function validateBookingDate(dateStr: string): string | null {
  if (!dateStr) {
    return 'Please select an expedition date.';
  }
  const selectedDate = new Date(dateStr);
  selectedDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(selectedDate.getTime())) {
    return 'Invalid date selected.';
  }
  if (selectedDate <= today) {
    return 'Expedition date must be a future date (starting from tomorrow).';
  }
  return null;
}

/**
 * Validates guest capacity count.
 */
export function validateGuestCount(count: number, maxCapacity: number = 12): string | null {
  if (!count || isNaN(count)) {
    return 'Number of guests is required.';
  }
  if (count < 1) {
    return 'Minimum 1 guest required.';
  }
  if (count > maxCapacity) {
    return `For groups exceeding ${maxCapacity} guests, please contact our concierge to arrange custom multi-vehicle fleet reservations.`;
  }
  return null;
}

/**
 * Validates contact form submission.
 */
export function validateContactForm(data: {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  const nameError = validateName(data.fullName);
  if (nameError) errors.fullName = nameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  if (data.phone && data.phone.trim()) {
    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.phone = phoneError;
  }

  if (!data.message || !data.message.trim()) {
    errors.message = 'Please enter your message or inquiry.';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates booking reservation form submission.
 */
export function validateBookingForm(data: {
  date: string;
  guestCount: number;
  fullName: string;
  email: string;
  phone: string;
  maxGuests?: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  const dateError = validateBookingDate(data.date);
  if (dateError) errors.date = dateError;

  const guestError = validateGuestCount(data.guestCount, data.maxGuests || 6);
  if (guestError) errors.guestCount = guestError;

  const nameError = validateName(data.fullName);
  if (nameError) errors.fullName = nameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates package management input form for Admin.
 */
export function validatePackageForm(data: {
  title: string;
  parkName: string;
  tagline: string;
  priceLkr: number;
  description: string;
  maxGuests: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title || !data.title.trim()) {
    errors.title = 'Package title is required.';
  }
  if (!data.parkName || !data.parkName.trim()) {
    errors.parkName = 'Park name is required.';
  }
  if (!data.tagline || !data.tagline.trim()) {
    errors.tagline = 'Tagline is required.';
  }
  if (!data.priceLkr || isNaN(data.priceLkr) || data.priceLkr <= 0) {
    errors.priceLkr = 'Please enter a valid price in LKR greater than 0.';
  }
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  }
  if (!data.maxGuests || isNaN(data.maxGuests) || data.maxGuests < 1 || data.maxGuests > 12) {
    errors.maxGuests = 'Max guests must be between 1 and 12.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
