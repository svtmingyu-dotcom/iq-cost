import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
  const { login, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56,
            height: 56,
            background: '#185FA5',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            margin: '0 auto 14px',
          }}>💡</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>IQ Cost</h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Система расчёта стоимости IT-проектов</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '28px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '1px solid #e8e8e8',
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: '#1a1a1a' }}>Вход в систему</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="your@email.ru"
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div style={{
                background: '#fff5f5',
                border: '1px solid #fecaca',
                borderRadius: 8,
                padding: '9px 12px',
                fontSize: 13,
                color: '#b91c1c',
                marginBottom: 14,
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: 14 }}
              disabled={loading}
            >
              {loading ? 'Входим...' : 'Войти'}
            </button>
          </form>
        </div>

        {/* Demo hint */}
        <div style={{
          marginTop: 20,
          background: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: 12,
          padding: '14px 18px',
          fontSize: 12,
          color: '#888',
        }}>
          <div style={{ fontWeight: 600, color: '#555', marginBottom: 8 }}>Демо-аккаунты:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>👑 Администратор</span>
              <span style={{ fontFamily: 'monospace' }}>admin@ics.ru / admin123</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>📊 Менеджер</span>
              <span style={{ fontFamily: 'monospace' }}>manager@ics.ru / manager123</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>👤 Кадровик</span>
              <span style={{ fontFamily: 'monospace' }}>hr@ics.ru / hr123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
