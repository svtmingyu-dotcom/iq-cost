import React, { useState } from 'react';
import useStore from '../store/useStore';
import Modal from '../components/Modal';

const EMPTY = { inn: '', name: '', fio: '', email: '', phone: '' };

export default function SubcontractorsPage() {
  const { subcontractors, addSubcontractor, updateSubcontractor, deleteSubcontractor } = useStore();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setForm(EMPTY); setModal({ isEdit: false }); };
  const openEdit = (s) => { setForm({ ...s }); setModal({ isEdit: true, id: s.id }); };
  const save = () => {
    if (modal.isEdit) updateSubcontractor({ ...form, id: modal.id });
    else addSubcontractor(form);
    setModal(null);
  };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="section-header">
        <h3>Реестр субподрядчиков</h3>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Добавить</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ИНН</th>
                <th>Название организации</th>
                <th>ФИО руководителя</th>
                <th>Email</th>
                <th>Телефон</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subcontractors.length === 0 && <tr><td colSpan={6}><div className="empty-state"><div className="icon">💼</div><p>Нет субподрядчиков</p></div></td></tr>}
              {subcontractors.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'monospace' }}>{s.inn}</td>
                  <td><strong style={{ fontWeight: 600 }}>{s.name}</strong></td>
                  <td>{s.fio}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-sm" onClick={() => openEdit(s)}>✏️</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteSubcontractor(s.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal.isEdit ? 'Редактировать субподрядчика' : 'Добавить субподрядчика'} onClose={() => setModal(null)} onSave={save}>
          <div className="form-group"><label>ИНН</label><input value={form.inn} onChange={(e) => set('inn', e.target.value)} /></div>
          <div className="form-group"><label>Название организации</label><input value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
          <div className="form-group"><label>ФИО руководителя</label><input value={form.fio} onChange={(e) => set('fio', e.target.value)} /></div>
          <div className="form-row cols-2">
            <div className="form-group" style={{ marginBottom: 0 }}><label>Email</label><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
            <div className="form-group" style={{ marginBottom: 0 }}><label>Телефон</label><input value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
