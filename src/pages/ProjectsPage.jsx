import React from 'react';
import useStore from '../store/useStore';
import { fmt, calcFinal, statusBadge } from '../utils';

export default function ProjectsPage({ onEdit }) {
  const { projects, customers, deleteProject, calcResourceCost } = useStore();

  const getProjectTotals = (p) => {
    const resources = p.resources || [];
    const cost = resources.reduce((s, r) => s + calcResourceCost(r), 0);
    const final = resources.reduce((s, r) => s + calcFinal(calcResourceCost(r), r.margin), 0);
    const withTax = final * (1 + (p.taxRate || 0) / 100);
    return { cost, final, withTax };
  };

  return (
    <div>
      <div className="section-header">
        <h3>Все проекты</h3>
        <button className="btn btn-primary btn-sm" onClick={() => onEdit(null)}>
          + Новый проект
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Статус</th>
                <th>Сроки</th>
                <th>Заказчик</th>
                <th style={{ textAlign: 'right' }}>Себестоимость</th>
                <th style={{ textAlign: 'right' }}>Итог с налогом</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="icon">📁</div>
                      <p>Нет проектов. Создайте первый.</p>
                    </div>
                  </td>
                </tr>
              )}
              {projects.map((p) => {
                const cust = customers.find((c) => c.id === p.customerId);
                const { cost, withTax } = getProjectTotals(p);
                return (
                  <tr key={p.id}>
                    <td>
                      <strong style={{ fontWeight: 600 }}>{p.name}</strong>
                      {p.desc && <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{p.desc}</div>}
                    </td>
                    <td><span className={`badge ${statusBadge(p.status)}`}>{p.status}</span></td>
                    <td style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>
                      {p.start || '—'} — {p.end || '—'}
                    </td>
                    <td>{cust ? cust.name || cust.fio : '—'}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 13 }}>{fmt(cost)}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 13, fontWeight: 600 }}>{fmt(withTax)}</td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-sm" onClick={() => onEdit(p.id)}>✏️</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteProject(p.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
