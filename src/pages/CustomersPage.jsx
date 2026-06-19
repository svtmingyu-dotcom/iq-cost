import React, { useState } from 'react';
import useStore from '../store/useStore';
import Modal from '../components/Modal';
import { CUSTOMER_TYPES } from '../utils';

const EMPTY = { inn: '', type: 'Юридическое лицо', name: '', fio: '', email: '', phone: '' };

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [modal, setModal] = useState(null); // null | { data, isEdit }
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setForm(EMPTY); setModal({ isEdit: false }); };
  const openEdit = (c) => { setForm({ ...c }); setModal({ isEdit: true, id: c.id }); };
  const closeModal = () => setModal(null);

  const save = () => {
    if (modal.isEdit) updateCustomer({ ...form, id: modal.id });
    else addCustomer(form);
    closeModal();
  };

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <div className="section-header">
        <h3>Реестр заказчиков</h3>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Добавить</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ИНН</th>
                <th>Тип</th>
                <th>Название / ФИО</th>
                <th>Email</th>
                <th>Телефон</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 && (
                <tr><td colSpan={6}><div className="empty-state"><div className="icon">🏢</div><p>Нет заказчиков</p></div></td></tr>
              )}
              {customers.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'monospace' }}>{c.inn}</td>
                  <td><span className="badge badge-gray">{c.type}</span></td>
                  <td>
                    <strong style={{ fontWeight: 600 }}>{c.name || c.fio}</strong>
                    {c.name && c.fio && <div style={{ fontSize: 11, color: '#aaa' }}>{c.fio}</div>}
                  </td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-sm" onClick={() => openEdit(c)}>✏️</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteCustomer(c.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal.isEdit ? 'Редактировать заказчика' : 'Добавить заказчика'} onClose={closeModal} onSave={save}>
          <div className="form-group"><label>ИНН</label><input value={form.inn} onChange={(e) => set('inn', e.target.value)} /></div>
          <div className="form-group">
            <label>Тип заказчика</label>
            <select value={form.type} onChange={(e) => set('type', e.target.value)}>
              {CUSTOMER_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          {form.type !== 'Физическое лицо' && (
            <div className="form-group"><label>Название организации</label><input value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
          )}
          <div className="form-group">
            <label>{form.type === 'Юридическое лицо' ? 'ФИО руководителя' : 'ФИО'}</label>
            <input value={form.fio} onChange={(e) => set('fio', e.target.value)} />
          </div>
          <div className="form-row cols-2">
            <div className="form-group" style={{ marginBottom: 0 }}><label>Email</label><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
            <div className="form-group" style={{ marginBottom: 0 }}><label>Телефон</label><input value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
