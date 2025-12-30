
import { USER_PASSWORD, ADMIN_PASSWORD } from '../constants';
import { UserRole, AccessKey } from '../types';

const DEFAULT_LIMIT = 20;

const generateSecurePassword = (length: number = 16): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let retVal = "";
  const cryptoObj = (typeof window !== 'undefined' && window.crypto) || (typeof globalThis !== 'undefined' && (globalThis as any).crypto);

  if (cryptoObj && cryptoObj.getRandomValues) {
    const values = new Uint32Array(length);
    cryptoObj.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      retVal += charset[values[i] % charset.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
  }
  return retVal;
};

export const createNewAccessKey = (label: string, role: UserRole, email?: string): AccessKey => {
  const savedKeys = typeof window !== 'undefined' ? getAllAccessKeys() : [];
  let newPassword = "";
  let isUnique = false;

  while (!isUnique) {
    newPassword = `KNV-${generateSecurePassword(12).toUpperCase()}`;
    isUnique = !savedKeys.some(k => k.password === newPassword);
  }

  const newKey: AccessKey = {
    id: (typeof window !== 'undefined' && window.crypto?.randomUUID) 
        ? window.crypto.randomUUID() 
        : `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    password: newPassword,
    label: label || `Acesso ${new Date().toLocaleDateString()}`,
    email: email,
    role: role,
    isActive: true,
    createdAt: Date.now(),
    usageCount: 0,
    usageLimit: DEFAULT_LIMIT
  };

  if (typeof window !== 'undefined') {
    saveAccessKey(newKey);
  }
  
  return newKey;
};

export const getAllAccessKeys = (): AccessKey[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('kanva_access_keys');
  if (!saved) {
    return [{
      id: 'default',
      password: USER_PASSWORD,
      label: 'Acesso Padrão (Sistema)',
      role: 'USER',
      isActive: true,
      createdAt: Date.now(),
      usageCount: 0,
      usageLimit: 100
    }];
  }
  return JSON.parse(saved);
};

export const saveAccessKey = (key: AccessKey) => {
  if (typeof window === 'undefined') return;
  const keys = getAllAccessKeys();
  localStorage.setItem('kanva_access_keys', JSON.stringify([...keys, key]));
};

export const incrementUsage = (password: string) => {
  if (typeof window === 'undefined') return;
  const keys = getAllAccessKeys();
  const updated = keys.map(k => {
    if (k.password === password) {
      return { ...k, usageCount: k.usageCount + 1, lastUsedAt: Date.now() };
    }
    return k;
  });
  localStorage.setItem('kanva_access_keys', JSON.stringify(updated));
};

export const checkUsageLimit = (password: string): { allowed: boolean; remaining: number } => {
  if (password === ADMIN_PASSWORD) return { allowed: true, remaining: 999 };
  const keys = getAllAccessKeys();
  const key = keys.find(k => k.password === password);
  if (!key) return { allowed: false, remaining: 0 };
  
  return { 
    allowed: key.usageCount < key.usageLimit,
    remaining: Math.max(0, key.usageLimit - key.usageCount)
  };
};

export const resetUsage = (id: string) => {
  if (typeof window === 'undefined') return;
  const keys = getAllAccessKeys();
  const updated = keys.map(k => k.id === id ? { ...k, usageCount: 0 } : k);
  localStorage.setItem('kanva_access_keys', JSON.stringify(updated));
};

export const updateAccessKeyStatus = (id: string, isActive: boolean) => {
  if (typeof window === 'undefined') return;
  const keys = getAllAccessKeys();
  const updated = keys.map(k => k.id === id ? { ...k, isActive } : k);
  localStorage.setItem('kanva_access_keys', JSON.stringify(updated));
};

export const deleteAccessKey = (id: string) => {
  if (typeof window === 'undefined') return;
  const keys = getAllAccessKeys();
  const filtered = keys.filter(k => k.id !== id);
  localStorage.setItem('kanva_access_keys', JSON.stringify(filtered));
};

export const validatePassword = (password: string): UserRole => {
  if (password === ADMIN_PASSWORD) return 'ADMIN';
  const keys = getAllAccessKeys();
  const foundKey = keys.find(k => k.password === password && k.isActive);
  if (foundKey) return foundKey.role;
  return 'NONE';
};

export const getSessionRole = (): UserRole => {
  if (typeof window === 'undefined') return 'NONE';
  return (localStorage.getItem('kanva_role') as UserRole) || 'NONE';
};

export const getSessionPassword = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('kanva_pass') || '';
};

export const setSession = (role: UserRole, password?: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kanva_role', role);
  if (password) localStorage.setItem('kanva_pass', password);
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('kanva_role');
  localStorage.removeItem('kanva_pass');
};
