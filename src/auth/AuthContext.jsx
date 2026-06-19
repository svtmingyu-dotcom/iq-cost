import React, { createContext, useContext, useState } from 'react';
import useStore from '../store/useStore';

const AuthContext = createContext(null);

// Демо-аккаунты (в реальном проекте — бэкенд + JWT)
const DEMO_ACCOUNTS = [
  { id: 1, email: 'admin@ics.ru',   password: 'admin123', roles: ['Глобальный администратор', 'Коммерческий директор'] },
  { id: 2, email: 'manager@ics.ru', password: 'manager123', roles: ['Коммерческий директор'] },
  { id: 3, email: 'hr@ics.ru',      password: 'hr123',      roles: ['Кадровик'] },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');

  const login = (email, password) => {
    const account = DEMO_ACCOUNTS.find(
      (a) => a.email === email && a.password === password
    );
    if (account) {
      setCurrentUser(account);
      setError('');
      return true;
    }
    setError('Неверный email или пароль');
    return false;
  };

  const logout = () => setCurrentUser(null);

  const isAdmin = currentUser?.roles?.includes('Глобальный администратор');

  const hasRole = (role) => currentUser?.roles?.includes(role);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin, hasRole, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
