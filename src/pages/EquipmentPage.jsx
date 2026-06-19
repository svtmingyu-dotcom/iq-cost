import React, { useState } from 'react';
import useStore from '../store/useStore';
import Modal from '../components/Modal';
import { fmt, ACQ_TYPES, UNITS } from '../utils';

const EMPTY = { name: '', desc: '', acqType: 'Собственное', opCost: 0, unit: 'дни', rate: 0 };

export default function EquipmentPage() {
  const { equipment, addEquipment, updateEquipment, deleteEquipment } = useStore();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setForm(EMPTY); setModal({ isEdit: false }); };
  const openEdit = (e) => { setForm({ ...e }); setModal({ isEdit: true, id: e.id }); };
  const save = () => {
    if (modal.isEdit) updateEquipment({ ...form, id: modal.id });
    else addEquipment(form);
    setModal(null);
  };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="section-header">
        <h3>Реестр оборудования</h3>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Добавить</button>
      </div>

      <div className="card" style={{ padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Формула расчёта стоимости:</div>
        <div className="formula-box">su = cez × soz</div>
        <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
          cez — количество единиц, soz — ставка за единицу
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Тип приобретения</th>
                <th>Эксп. стоимость</th>
                <th>Ед. изм.</th>
                <th style={{ textAlign: 'right' }}>Ставка</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {equipment.length === 0 && <tr><td colSpan={6}><div className="empty-state"><div className="icon">🖥</div><p>Нет оборудования</p></div></td></tr>}
              {equipment.map((e) => (
                <tr key={e.id}>
                  <td>
                    <strong style={{ fontWeight: 600 }}>{e.name}</strong>
                    {e.desc && <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{e.desc}</div>}
                  </td>
                  <td><span className={`badge ${e.acqType === 'Собственное' ? 'badge-green' : 'badge-amber'}`}>{e.acqType}</span></td>
                  <td>{e.acqType === 'В аренде' ? fmt(e.opCost) : '—'}</td>
                  <td>{e.unit}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{fmt(e.rate)}/{e.unit}</td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-sm" onClick={() => openEdit(e)}>✏️</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteEquipment(e.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal.isEdit ? 'Редактировать оборудование' : 'Добавить оборудование'} onClose={() => setModal(null)} onSave={save}>
          <div className="form-group"><label>Название</label><input value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
          <div className="form-group"><label>Описание</label><input value={form.desc} onChange={(e) => set('desc', e.target.value)} /></div>
          <div className="form-group">
            <label>Тип приобретения</label>
            <select value={form.acqType} onChange={(e) => set('acqType', e.target.value)}>
              {ACQ_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          {form.acqType === 'В аренде' && (
            <div className="form-group">
              <label>Минимальная эксплуатационная стоимость (₽)</label>
              <input type="number" value={form.opCost} onChange={(e) => set('opCost', parseFloat(e.target.value) || 0)} />
            </div>
          )}
          <div className="form-row cols-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Единица измерения</label>
              <select value={form.unit} onChange={(e) => set('unit', e.target.value)}>
                {UNITS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Ставка за единицу (₽)</label>
              <input type="number" value={form.rate} onChange={(e) => set('rate', parseFloat(e.target.value) || 0)} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
