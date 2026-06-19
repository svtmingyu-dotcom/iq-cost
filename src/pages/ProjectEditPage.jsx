import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { fmt, calcFinal, PROJECT_STATUSES, RESOURCE_TYPES } from '../utils';

const EMPTY_PROJECT = {
  name: '',
  start: '',
  end: '',
  status: 'Новый',
  customerId: null,
  desc: '',
  taxRate: 20,
  resources: [],
};

export default function ProjectEditPage({ projectId, onBack }) {
  const {
    projects, customers, employees, contractors, subcontractors, equipment,
    addProject, updateProject, calcResourceCost,
  } = useStore();

  const existing = projectId ? projects.find((p) => p.id === projectId) : null;
  const [project, setProject] = useState(
    existing ? JSON.parse(JSON.stringify(existing)) : { ...EMPTY_PROJECT, id: Date.now() }
  );
  const [tab, setTab] = useState('info');

  useEffect(() => {
    const p = projectId ? projects.find((x) => x.id === projectId) : null;
    setProject(p ? JSON.parse(JSON.stringify(p)) : { ...EMPTY_PROJECT, id: Date.now() });
  }, [projectId]);

  const save = () => {
    if (existing) updateProject(project);
    else addProject(project);
    onBack();
  };

  const setField = (key, val) => setProject((p) => ({ ...p, [key]: val }));

  const resources = project.resources || [];
  const totalCost = resources.reduce((s, r) => s + calcResourceCost(r), 0);
  const totalFinal = resources.reduce((s, r) => s + calcFinal(calcResourceCost(r), r.margin), 0);
  const withTax = totalFinal * (1 + (project.taxRate || 0) / 100);
  const profit = totalFinal - totalCost;

  // Resource helpers
  const addResource = () =>
    setProject((p) => ({
      ...p,
      resources: [...(p.resources || []), { id: Date.now(), name: '', type: 'Сотрудник', executorId: null, qty: 0, cost: 0, margin: 0 }],
    }));

  const updateResource = (idx, key, val) =>
    setProject((p) => {
      const resources = [...p.resources];
      resources[idx] = { ...resources[idx], [key]: val };
      return { ...p, resources };
    });

  const removeResource = (idx) =>
    setProject((p) => ({ ...p, resources: p.resources.filter((_, i) => i !== idx) }));

  const getExecutors = (type) => {
    if (type === 'Сотрудник') return employees.map((e) => ({ id: e.id, label: `${e.lastname} ${e.firstname}` }));
    if (type === 'Исполнитель') return contractors.map((c) => ({ id: c.id, label: `${c.lastname} ${c.firstname}` }));
    if (type === 'Субподрядчик') return subcontractors.map((s) => ({ id: s.id, label: s.name }));
    if (type === 'Оборудование') return equipment.map((e) => ({ id: e.id, label: e.name }));
    return [];
  };

  const custOptions = customers.map((c) => (
    <option key={c.id} value={c.id}>{c.name || c.fio}</option>
  ));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div className="breadcrumb" onClick={onBack}>
          ← Проекты
        </div>
        <button className="btn btn-primary btn-sm" onClick={save}>
          ✓ Сохранить
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <div className={`tab ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>
          Реквизиты проекта
        </div>
        <div className={`tab ${tab === 'resources' ? 'active' : ''}`} onClick={() => setTab('resources')}>
          Управление ресурсами ({resources.length})
        </div>
      </div>

      {tab === 'info' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
          {/* Left */}
          <div>
            <div className="card">
              <div className="form-group">
                <label>Название проекта</label>
                <input value={project.name} onChange={(e) => setField('name', e.target.value)} placeholder="Введите название" />
              </div>
              <div className="form-row cols-2">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Дата начала</label>
                  <input type="date" value={project.start} onChange={(e) => setField('start', e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Дата окончания</label>
                  <input type="date" value={project.end} onChange={(e) => setField('end', e.target.value)} />
                </div>
              </div>
              <div style={{ marginTop: 14 }} className="form-row cols-2">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Статус</label>
                  <select value={project.status} onChange={(e) => setField('status', e.target.value)}>
                    {PROJECT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Налоговая ставка (%)</label>
                  <input type="number" value={project.taxRate} onChange={(e) => setField('taxRate', parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 14 }}>
                <label>Заказчик <span style={{ color: '#aaa', fontWeight: 400 }}>(необязательно)</span></label>
                <select
                  value={project.customerId || ''}
                  onChange={(e) => setField('customerId', e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">— Без заказчика —</option>
                  {custOptions}
                </select>
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea value={project.desc} onChange={(e) => setField('desc', e.target.value)} placeholder="Краткое описание проекта" />
              </div>
            </div>
          </div>

          {/* Right: Metrics */}
          <div>
            <div className="metric-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="metric-card">
                <div className="metric-label">Себестоимость</div>
                <div className="metric-value">{fmt(totalCost)}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">С маржинальностью</div>
                <div className="metric-value blue">{fmt(totalFinal)}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Итог с налогом ({project.taxRate}%)</div>
                <div className="metric-value blue">{fmt(withTax)}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Чистая прибыль</div>
                <div className="metric-value green">{fmt(profit)}</div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Формулы расчёта</div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Итоговая стоимость с налогом:</div>
              <div className="formula-box">isp = sp + (sp × ns)</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
                isp — итоговая стоимость с налогом<br />
                sp — стоимость с маржинальностью, ns — налоговая ставка %
              </div>
              <div style={{ fontSize: 12, color: '#888', margin: '12px 0 4px' }}>Чистая прибыль:</div>
              <div className="formula-box">p = Σ (итог_услуги − себест_услуги)</div>

              {project.customerId && (
                <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="btn btn-sm" onClick={() => alert('Формирование КП — в разработке')}>
                    📄 Коммерческое предложение
                  </button>
                  <button className="btn btn-sm" onClick={() => alert('Формирование НМА — в разработке')}>
                    📊 Стоимость НМА
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'resources' && (
        <div>
          <div className="section-header">
            <div style={{ fontSize: 13, color: '#888' }}>Ресурсы, задействованные в проекте</div>
            <button className="btn btn-primary btn-sm" onClick={addResource}>+ Добавить ресурс</button>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-wrapper">
              <table className="res-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: 160 }}>Название услуги</th>
                    <th style={{ minWidth: 120 }}>Тип ресурса</th>
                    <th style={{ minWidth: 160 }}>Исполнитель</th>
                    <th style={{ minWidth: 90 }}>Кол-во ед.</th>
                    <th style={{ minWidth: 80 }}>Маржа %</th>
                    <th style={{ minWidth: 110, textAlign: 'right' }}>Себестоимость</th>
                    <th style={{ minWidth: 110, textAlign: 'right' }}>Итого</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {resources.length === 0 && (
                    <tr>
                      <td colSpan={8}>
                        <div className="empty-state">
                          <div className="icon">👷</div>
                          <p>Добавьте ресурсы для расчёта стоимости</p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {resources.map((r, idx) => {
                    const execs = getExecutors(r.type);
                    const cost = calcResourceCost(r);
                    const fin = calcFinal(cost, r.margin);
                    return (
                      <tr key={r.id}>
                        <td>
                          <input
                            value={r.name}
                            onChange={(e) => updateResource(idx, 'name', e.target.value)}
                            placeholder="Название услуги"
                          />
                        </td>
                        <td>
                          <select
                            value={r.type}
                            onChange={(e) => updateResource(idx, 'type', e.target.value)}
                          >
                            {RESOURCE_TYPES.map((t) => <option key={t}>{t}</option>)}
                          </select>
                        </td>
                        <td>
                          <select
                            value={r.executorId || ''}
                            onChange={(e) => updateResource(idx, 'executorId', e.target.value ? parseInt(e.target.value) : null)}
                          >
                            <option value="">— Выбрать —</option>
                            {execs.map((e) => <option key={e.id} value={e.id}>{e.label}</option>)}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={r.qty}
                            onChange={(e) => updateResource(idx, 'qty', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            style={{ textAlign: 'right' }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={r.margin}
                            onChange={(e) => updateResource(idx, 'margin', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            style={{ textAlign: 'right' }}
                          />
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12, padding: '6px 14px' }}>
                          {fmt(cost)}
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12, fontWeight: 600, padding: '6px 14px' }}>
                          {fmt(fin)}
                        </td>
                        <td>
                          <button className="btn btn-icon btn-danger" onClick={() => removeResource(idx)}>🗑</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sum-bar">
            <div className="sum-item">
              <div className="s-label">Себестоимость</div>
              <div className="s-val">{fmt(totalCost)}</div>
            </div>
            <div className="sum-item">
              <div className="s-label">С маржинальностью</div>
              <div className="s-val blue">{fmt(totalFinal)}</div>
            </div>
            <div className="sum-item">
              <div className="s-label">Итог с налогом ({project.taxRate}%)</div>
              <div className="s-val blue">{fmt(withTax)}</div>
            </div>
            <div className="sum-item">
              <div className="s-label">Чистая прибыль</div>
              <div className="s-val green">{fmt(profit)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
