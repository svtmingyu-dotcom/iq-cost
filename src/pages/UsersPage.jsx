import React, { useState } from 'react';
import useStore from '../store/useStore';
import Modal from '../components/Modal';
import { ALL_ROLES, initials } from '../utils';

const EMPTY = { lastname: '', firstname: '', middlename: '', email: '', position: '', roles: [] };

export default function UsersPage() {
  const { users, addUser, deleteUser } = useStore();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setForm(EMPTY); setModal(true); };
  const save = () => { addUser(form); setModal(false); };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleRole = (role) => setForm((f) => ({
    ...f,
    roles: f.roles.includes(role) ? f.roles.filter((r) => r !== role) : [...f.roles, role],
  }));

  return (
    <div>
      <div className="section-header">
        <h3>Участники рабочей области</h3>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Добавить</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Email</th>
                <th>Роли</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && <tr><td colSpan={4}><div className="empty-state"><div className="icon">👥</div><p>Нет участников</p></div></td></tr>}
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar">{initials(u.lastname, u.firstname)}</div>
                      <div>
                        <strong style={{ fontWeight: 600 }}>{u.lastname} {u.firstname} {u.middlename}</strong>
                        <div style={{ fontSize: 11, color: '#aaa' }}>{u.position}</div>
                      </div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {(u.roles || []).map((r) => <span key={r} className="badge badge-blue">{r}</span>)}
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title="Добавить участника" onClose={() => setModal(false)} onSave={save}>
          <div className="form-row cols-2">
            <div className="form-group" style={{ marginBottom: 0 }}><label>Фамилия</label><input value={form.lastname} onChange={(e) => set('lastname', e.target.value)} /></div>
            <div className="form-group" style={{ marginBottom: 0 }}><label>Имя</label><input value={form.firstname} onChange={(e) => set('firstname', e.target.value)} /></div>
          </div>
          <div className="form-group" style={{ marginTop: 14 }}><label>Отчество</label><input value={form.middlename} onChange={(e) => set('middlename', e.target.value)} /></div>
          <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
          <div className="form-group"><label>Должность</label><input value={form.position} onChange={(e) => set('position', e.target.value)} /></div>
          <div className="form-group">
            <label>Роли</label>
            {ALL_ROLES.map((role) => (
              <label key={role} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#1a1a1a', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.roles.includes(role)} onChange={() => toggleRole(role)} style={{ width: 'auto', cursor: 'pointer' }} />
                {role}
              </label>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
