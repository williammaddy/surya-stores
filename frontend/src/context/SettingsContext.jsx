import React, { createContext, useContext, useState, useEffect } from 'react';
import settingsService from '../services/settingsService';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    storeName: 'Surya Stores',
    phone: '+91 98765 43210',
    whatsAppNumber: '+91 98765 43210',
    email: 'info@suryastores.com',
    address: 'Shop #12, Surya Complex, Main Market Road, City Center',
    businessHours: 'Mon - Sat: 9:00 AM - 9:30 PM | Sun: 10:00 AM - 2:00 PM',
    aboutText:
      'Surya Stores is your premier local destination for high-quality stationery, academic school guides, office supplies, art materials, and educational toys.',
    logo: '',
    socialLinks: { facebook: '', instagram: '', twitter: '' },
    lowStockThreshold: 10,
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsService.getSettings();
      if (res.data.success && res.data.data) {
        setSettings(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load store settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = () => {
    fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
