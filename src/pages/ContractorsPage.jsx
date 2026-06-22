import React, { useState } from 'react';
import useStore from '../store/useStore';
import Modal from '../components/Modal';
import { fmt, CONTRACT_TYPES, UNITS } from '../utils';

const EMPTY = { lastname: '', firstname: '', middlename: '', type: 'НПД', taxRate: 0, unit: 'часы', rate: 0 };

export default function ContractorsPage() {
  const { contractors, addContractor, updateContractor, deleteContractor } = useStore();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setForm(EMPTY); setModal({ isEdit: false }); };
  const openEdit = (c) => { setForm({ ...c }); setModal({ isEdit: true, id: c.id }); };
  const save = () => {
    if (modal.isEdit) updateContractor({ ...form, id: modal.id });
    else addContractor(form);
    setModal(null);
  };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="section-header">
        <h3>Реестр исполнителей</h3>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Добавить</button>
      </div>

      <div className="card" style={{ padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Формула расчёта стоимости услуг:</div>
        <div className="formula-box">su = (cez × suz) + (cez × suz × ns)</div>
        <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
          cez — кол-во единиц, suz — ставка за единицу, ns — налог (только для ГПХ)
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Тип</th>
                <th>Налог</th>
                <th>Ед. изм.</th>
                <th style={{ textAlign: 'right' }}>Ставка</th>
                <th style={{ textAlign: 'right' }}>С налогом</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {contractors.length === 0 && <tr><td colSpan={7}><div className="empty-state"><p>Нет исполнителей</p></div></td></tr>}
              {contractors.map((c) => {
                const withTax = c.rate * (1 + c.taxRate / 100);
                return (
                  <tr key={c.id}>
                    <td><strong style={{ fontWeight: 600 }}>{c.lastname} {c.firstname} {c.middlename}</strong></td>
                    <td><span className={`badge ${c.type === 'НПД' ? 'badge-green' : 'badge-amber'}`}>{c.type}</span></td>
                    <td>{c.taxRate}%</td>
                    <td>{c.unit}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{fmt(c.rate)}/{c.unit === 'часы' ? 'ч' : 'д'}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{fmt(withTax)}</td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-sm" onClick={() => openEdit(c)}>✏️</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteContractor(c.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal.isEdit ? 'Редактировать исполнителя' : 'Добавить исполнителя'} onClose={() => setModal(null)} onSave={save}>
          <div className="form-row cols-2">
            <div className="form-group" style={{ marginBottom: 0 }}><label>Фамилия</label><input value={form.lastname} onChange={(e) => set('lastname', e.target.value)} /></div>
            <div className="form-group" style={{ marginBottom: 0 }}><label>Имя</label><input value={form.firstname} onChange={(e) => set('firstname', e.target.value)} /></div>
          </div>
          <div className="form-group" style={{ marginTop: 14 }}><label>Отчество</label><input value={form.middlename} onChange={(e) => set('middlename', e.target.value)} /></div>
          <div className="form-group">
            <label>Тип оформления</label>
            <select value={form.type} onChange={(e) => { set('type', e.target.value); if (e.target.value === 'НПД') set('taxRate', 0); }}>
              {CONTRACT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-row cols-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Налоговая ставка (%)</label>
              <input type="number" value={form.taxRate} disabled={form.type === 'НПД'} onChange={(e) => set('taxRate', parseFloat(e.target.value) || 0)} />
              {form.type === 'НПД' && <span className="info-hint">При НПД налог платит сам самозанятый</span>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Единица измерения</label>
              <select value={form.unit} onChange={(e) => set('unit', e.target.value)}>
                {UNITS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 14 }}><label>Ставка за единицу (₽)</label><input type="number" value={form.rate} onChange={(e) => set('rate', parseFloat(e.target.value) || 0)} /></div>
        </Modal>
      )}
    </div>
  );
}
