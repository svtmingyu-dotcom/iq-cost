import React from 'react';
import { useAuth } from '../auth/AuthContext';

const NAV = [
  {
    section: 'Рабочее пространство',
    items: [
      { key: 'projects',  label: 'Проекты' },
      { key: 'users',     label: 'Участники', adminOnly: true },
    ],
  },
  {
    section: 'Реестры',
    items: [
      { key: 'customers',      label: 'Заказчики' },
      { key: 'employees',      label: 'Сотрудники' },
      { key: 'contractors',    label: 'Исполнители' },
      { key: 'subcontractors', label: 'Субподрядчики' },
      { key: 'equipment',      label: 'Оборудование' },
    ],
  },
  {
    section: 'Система',
    items: [
      { key: 'settings', label: 'Настройки', adminOnly: true },
    ],
  },
];

export default function Sidebar({ page, onNav }) {
  const { isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>IQ Cost</h1>
        <span>Расчёт IT-проектов</span>
      </div>
      {NAV.map((group) => (
        <div key={group.section}>
          <div className="nav-section">{group.section}</div>
          {group.items.map((item) => {
            const locked = item.adminOnly && !isAdmin;
            return (
              <div
                key={item.key}
                className={`nav-item ${page === item.key ? 'active' : ''} ${locked ? 'nav-locked' : ''}`}
                onClick={() => onNav(item.key)}
                title={locked ? 'Только для администраторов' : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}

              </div>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
