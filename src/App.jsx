import React, { useState } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectEditPage from './pages/ProjectEditPage';
import CustomersPage from './pages/CustomersPage';
import EmployeesPage from './pages/EmployeesPage';
import ContractorsPage from './pages/ContractorsPage';
import SubcontractorsPage from './pages/SubcontractorsPage';
import EquipmentPage from './pages/EquipmentPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';

const PAGE_TITLES = {
  projects: 'Проекты',
  customers: 'Реестр заказчиков',
  employees: 'Реестр сотрудников',
  contractors: 'Реестр исполнителей',
  subcontractors: 'Реестр субподрядчиков',
  equipment: 'Реестр оборудования',
  users: 'Участники',
  settings: 'Настройки',
  project_edit: 'Управление проектом',
};

// Страницы только для администратора
const ADMIN_ONLY_PAGES = ['users', 'settings'];

function AccessDenied() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '60vh', color: '#aaa', gap: 12,
    }}>
      {/* <div style={{ fontSize: 48 }}>🔒</div> */}
      <div style={{ fontSize: 16, fontWeight: 600, color: '#555' }}>Доступ запрещён</div>
      <div style={{ fontSize: 13 }}>Эта страница доступна только администраторам</div>
    </div>
  );
}

function AppInner() {
  const { currentUser, isAdmin, logout } = useAuth();
  const [page, setPage] = useState('projects');
  const [editProjectId, setEditProjectId] = useState(null);

  if (!currentUser) return <LoginPage />;

  const handleEditProject = (id) => { setEditProjectId(id); setPage('project_edit'); };
  const handleBackToProjects = () => { setPage('projects'); setEditProjectId(null); };
  const handleNav = (p) => { setPage(p); setEditProjectId(null); };

  const isRestricted = ADMIN_ONLY_PAGES.includes(page) && !isAdmin;

  return (
    <div className="app">
      <Sidebar page={page === 'project_edit' ? 'projects' : page} onNav={handleNav} />
      <div className="main">
        <div className="topbar">
          <h2>{PAGE_TITLES[page] || ''}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Инфо о пользователе */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: isAdmin ? '#185FA5' : '#e8f5e9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 600,
                color: isAdmin ? '#fff' : '#2d7a3e',
              }}>
                {currentUser.email[0].toUpperCase()}
              </div>
              <div style={{ fontSize: 12 }}>
                <div style={{ fontWeight: 500, color: '#1a1a1a' }}>{currentUser.email}</div>
                <div style={{ color: '#aaa', fontSize: 11 }}>
                  {isAdmin ? 'Администратор' : currentUser.roles.join(', ')}
                </div>
              </div>
            </div>
            <button className="btn btn-sm" onClick={logout}>Выйти</button>
          </div>
        </div>
        <div className="content">
          {isRestricted ? <AccessDenied /> : (
            <>
              {page === 'projects' && <ProjectsPage onEdit={handleEditProject} />}
              {page === 'project_edit' && <ProjectEditPage projectId={editProjectId} onBack={handleBackToProjects} />}
              {page === 'customers' && <CustomersPage />}
              {page === 'employees' && <EmployeesPage />}
              {page === 'contractors' && <ContractorsPage />}
              {page === 'subcontractors' && <SubcontractorsPage />}
              {page === 'equipment' && <EquipmentPage />}
              {page === 'users' && <UsersPage />}
              {page === 'settings' && <SettingsPage />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
