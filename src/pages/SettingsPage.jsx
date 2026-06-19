import React from 'react';
import useStore from '../store/useStore';

export default function SettingsPage() {
  const { settings, updateSettings } = useStore();
  const set = (k, v) => updateSettings({ [k]: v });

  return (
    <div>
      <div className="section-header">
        <h3>Настройки системы</h3>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <div className="card-title">Реквизиты компании</div>

        <div className="form-group">
          <label>Название компании</label>
          <input value={settings.company} onChange={(e) => set('company', e.target.value)} />
        </div>

        <div className="form-row cols-2">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>ФИО руководителя</label>
            <input value={settings.director} onChange={(e) => set('director', e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Должность руководителя</label>
            <input value={settings.position} onChange={(e) => set('position', e.target.value)} />
          </div>
        </div>

        <div className="divider" />

        <div className="form-row cols-2">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Контактный телефон</label>
            <input value={settings.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Контактный email</label>
            <input type="email" value={settings.email} onChange={(e) => set('email', e.target.value)} />
          </div>
        </div>

        <div className="divider" />

        <div className="form-group">
          <label>Логотип предприятия</label>
          <div
            style={{
              border: '2px dashed #e0e0e0',
              borderRadius: 10,
              padding: '28px 20px',
              textAlign: 'center',
              color: '#aaa',
              fontSize: 13,
              cursor: 'pointer',
              background: '#fafafa',
            }}
            onClick={() => alert('Загрузка логотипа — подключите обработчик файлов')}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>🖼</div>
            Перетащите файл или нажмите для выбора
            <div style={{ fontSize: 11, marginTop: 4 }}>PNG, JPG до 2 МБ</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            onClick={() => alert('Настройки сохранены')}
          >
            ✓ Сохранить
          </button>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <div className="card-title">Рабочая область</div>
        <div className="form-group">
          <label>Название рабочей области</label>
          <input placeholder="Например: Основная" />
        </div>
        <div className="form-group">
          <label>Поддомен</label>
          <input placeholder="workspace1" />
          <span className="info-hint">Адрес доступа: ptm.iqnix.tech/workspace1</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary">✓ Сохранить</button>
        </div>
      </div>
    </div>
  );
}
