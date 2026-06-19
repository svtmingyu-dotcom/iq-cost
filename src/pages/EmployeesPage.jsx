import React, { useState } from 'react';
import useStore from '../store/useStore';
import Modal from '../components/Modal';
import { fmt } from '../utils';

const EMPTY = { lastname: '', firstname: '', middlename: '', position: '', salary: 0, taxRate: 30.2 };

export default function EmployeesPage() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useStore();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setForm(EMPTY); setModal({ isEdit: false }); };
  const openEdit = (e) => { setForm({ ...e }); setModal({ isEdit: true, id: e.id }); };
  const save = () => {
    if (modal.isEdit) updateEmployee({ ...form, id: modal.id });
    else addEmployee(form);
    setModal(null);
  };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="section-header">
        <h3>Реестр сотрудников</h3>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Добавить</button>
      </div>

      <div className="card" style={{ padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Формула расчёта себестоимости дня:</div>
        <div className="formula-box">sr = cwd × ((зп + зп × ns) / рабочих_дней_месяца)</div>
        <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
          cwd — количество дней, зп — оклад в месяц, ns — налоговая ставка
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Должность</th>
                <th>Оклад</th>
                <th>Налог</th>
                <th style={{ textAlign: 'right' }}>Стоимость дня (с налогом)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 && <tr><td colSpan={6}><div className="empty-state"><div className="icon">🪪</div><p>Нет сотрудников</p></div></td></tr>}
              {employees.map((e) => {
                const dayRate = (e.salary / 21) * (1 + e.taxRate / 100);
                return (
                  <tr key={e.id}>
                    <td><strong style={{ fontWeight: 600 }}>{e.lastname} {e.firstname} {e.middlename}</strong></td>
                    <td>{e.position}</td>
                    <td style={{ fontFamily: 'monospace' }}>{e.salary.toLocaleString('ru-RU')} ₽/мес</td>
                    <td><span className="badge badge-amber">{e.taxRate}%</span></td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{fmt(dayRate)}/день</td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-sm" onClick={() => openEdit(e)}>✏️</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteEmployee(e.id)}>🗑</button>
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
        <Modal title={modal.isEdit ? 'Редактировать сотрудника' : 'Добавить сотрудника'} onClose={() => setModal(null)} onSave={save}>
          <div className="form-row cols-2">
            <div className="form-group" style={{ marginBottom: 0 }}><label>Фамилия</label><input value={form.lastname} onChange={(e) => set('lastname', e.target.value)} /></div>
            <div className="form-group" style={{ marginBottom: 0 }}><label>Имя</label><input value={form.firstname} onChange={(e) => set('firstname', e.target.value)} /></div>
          </div>
          <div className="form-group" style={{ marginTop: 14 }}><label>Отчество</label><input value={form.middlename} onChange={(e) => set('middlename', e.target.value)} /></div>
          <div className="form-group"><label>Должность</label><input value={form.position} onChange={(e) => set('position', e.target.value)} /></div>
          <div className="form-row cols-2">
            <div className="form-group" style={{ marginBottom: 0 }}><label>Оклад (₽/мес)</label><input type="number" value={form.salary} onChange={(e) => set('salary', parseFloat(e.target.value) || 0)} /></div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Налоговая ставка (%)</label>
              <input type="number" value={form.taxRate} onChange={(e) => set('taxRate', parseFloat(e.target.value) || 0)} />
              <span className="info-hint">Обычно 30.2% или 7.6%</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
