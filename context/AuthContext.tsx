'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { validateEmail, validatePassword, validateName, validatePhone } from '../lib/validation';
import {
  registerUserInFirestore,
  authenticateUserInFirestore,
  addBookingToUserInFirestore,
} from '../lib/firestore-service';

export interface UserBooking {
  id: string;
  packageName: string;
  date: string;
  timeSlot?: string;
  vehicle?: string;
  guests: number;
  totalPrice: number;
  status: 'Confirmed' | 'Completed' | 'Pending';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  bookings: UserBooking[];
}

const AUTH_USER_KEY = 'wildking_user_session';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailInput: string, passwordInput: string) => Promise<{ success: boolean; error?: string }>;
  register: (nameInput: string, emailInput: string, phoneInput: string, passwordInput: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  addBookingToUser: (booking: UserBooking) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore user session on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_USER_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.warn('Failed to load user session from localStorage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist user session when state changes
  const saveUserSession = (newUser: UserProfile | null) => {
    setUser(newUser);
    try {
      if (newUser) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    } catch (err) {
      console.warn('Failed to persist user session:', err);
    }
  };

  const login = async (emailInput: string, passwordInput: string): Promise<{ success: boolean; error?: string }> => {
    // Validate inputs
    const emailErr = validateEmail(emailInput);
    if (emailErr) return { success: false, error: emailErr };

    const passErr = validatePassword(passwordInput, 6);
    if (passErr) return { success: false, error: passErr };

    // Auto-create demo user in DB if trying demo login
    if (emailInput.toLowerCase() === 'alexander.w@wildking-safari.com') {
      const demoRes = await registerUserInFirestore(
        'Alexander Wright',
        'alexander.w@wildking-safari.com',
        '+1 (555) 234-5678',
        passwordInput || 'SafariPass123#'
      );
      if (!demoRes.success && demoRes.error?.includes('already exists')) {
        // Continue to auth check below
      } else if (demoRes.success && demoRes.user) {
        saveUserSession(demoRes.user);
        return { success: true };
      }
    }

    // Authenticate user against database (checks email existence and password hash match)
    const authRes = await authenticateUserInFirestore(emailInput, passwordInput);
    if (!authRes.success) {
      return { success: false, error: authRes.error };
    }

    saveUserSession(authRes.user);
    return { success: true };
  };

  const register = async (
    nameInput: string,
    emailInput: string,
    phoneInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; error?: string }> => {
    const nameErr = validateName(nameInput);
    if (nameErr) return { success: false, error: nameErr };

    const emailErr = validateEmail(emailInput);
    if (emailErr) return { success: false, error: emailErr };

    const phoneErr = validatePhone(phoneInput);
    if (phoneErr) return { success: false, error: phoneErr };

    const passErr = validatePassword(passwordInput, 6);
    if (passErr) return { success: false, error: passErr };

    // Record user account creation in database
    const regRes = await registerUserInFirestore(nameInput, emailInput, phoneInput, passwordInput);
    if (!regRes.success) {
      return { success: false, error: regRes.error };
    }

    saveUserSession(regRes.user);
    return { success: true };
  };

  const logout = () => {
    saveUserSession(null);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const updatedProfile = { ...user, ...updated };
    saveUserSession(updatedProfile);
  };

  const addBookingToUser = (booking: UserBooking) => {
    if (!user) return;
    const updatedBookings = [booking, ...(user.bookings || [])];
    updateProfile({ bookings: updatedBookings });

    // Sync booking to user record in database
    addBookingToUserInFirestore(user.email, booking);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        addBookingToUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
