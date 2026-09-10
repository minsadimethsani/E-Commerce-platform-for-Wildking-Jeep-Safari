'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'LKR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  name: string;
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', label: 'USD ($)', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR (€)', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP (£)', name: 'British Pound' },
  AUD: { code: 'AUD', symbol: 'A$', label: 'AUD (A$)', name: 'Australian Dollar' },
  LKR: { code: 'LKR', symbol: 'Rs. ', label: 'LKR (Rs.)', name: 'Sri Lankan Rupee' },
};

const FALLBACK_RATES: Record<CurrencyCode, number> = {
  LKR: 1,
  USD: 1 / 305,
  EUR: 0.92 / 305,
  GBP: 0.79 / 305,
  AUD: 1.52 / 305,
};

const LOCAL_STORAGE_KEY = 'wildking_currency';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amountInLKR: number) => string;
  rates: Record<CurrencyCode, number>;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user selected currency from localStorage on mount
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem(LOCAL_STORAGE_KEY) as CurrencyCode | null;
      if (savedCurrency && savedCurrency in CURRENCY_CONFIGS) {
        setCurrencyState(savedCurrency);
      }
    } catch (e) {
      console.warn('Unable to read wildking_currency from localStorage:', e);
    }
  }, []);

  // Update selected currency and persist to localStorage
  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, newCurrency);
    } catch (e) {
      console.warn('Unable to save wildking_currency to localStorage:', e);
    }
  };

  // Fetch live exchange rates on mount from open.er-api.com
  useEffect(() => {
    let isMounted = true;
    const fetchRates = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/LKR');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.rates && isMounted) {
          setRates({
            LKR: 1,
            USD: data.rates.USD || FALLBACK_RATES.USD,
            EUR: data.rates.EUR || FALLBACK_RATES.EUR,
            GBP: data.rates.GBP || FALLBACK_RATES.GBP,
            AUD: data.rates.AUD || FALLBACK_RATES.AUD,
          });
        }
      } catch (err) {
        console.warn('Failed to fetch live currency rates, using fallback rates:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRates();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatPrice = (amountInLKR: number): string => {
    if (amountInLKR === undefined || amountInLKR === null || isNaN(amountInLKR)) {
      return '';
    }

    const currentRate = rates[currency] || FALLBACK_RATES[currency] || FALLBACK_RATES.USD;
    const convertedAmount = amountInLKR * currentRate;
    const roundedAmount = Math.round(convertedAmount);

    const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
    return `${config.symbol}${roundedAmount.toLocaleString('en-US')}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, rates, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
