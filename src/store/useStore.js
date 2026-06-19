import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Settings
  settings: {
    company: 'ИКС Технологии',
    director: 'Иванов А.В.',
    position: 'Генеральный директор',
    phone: '+7 (495) 123-45-67',
    email: 'info@ics.ru',
  },
  updateSettings: (data) => set((s) => ({ settings: { ...s.settings, ...data } })),

  // Customers
  customers: [
    { id: 1, inn: '7701234567', type: 'Юридическое лицо', name: 'ООО "Альфа-Технологии"', fio: 'Петров Сергей Михайлович', email: 'petrov@alfa.ru', phone: '+7 (916) 111-22-33' },
    { id: 2, inn: '500112345', type: 'Индивидуальный предприниматель', name: 'ИП Смирнова К.В.', fio: 'Смирнова Кристина Валерьевна', email: 'smirnova@mail.ru', phone: '+7 (903) 456-78-90' },
  ],
  addCustomer: (c) => set((s) => ({ customers: [...s.customers, { ...c, id: Date.now() }] })),
  updateCustomer: (c) => set((s) => ({ customers: s.customers.map((x) => (x.id === c.id ? c : x)) })),
  deleteCustomer: (id) => set((s) => ({ customers: s.customers.filter((x) => x.id !== id) })),

  // Employees
  employees: [
    { id: 1, lastname: 'Козлов', firstname: 'Дмитрий', middlename: 'Олегович', position: 'Разработчик', salary: 150000, taxRate: 30.2 },
    { id: 2, lastname: 'Новикова', firstname: 'Анна', middlename: '', position: 'Дизайнер', salary: 120000, taxRate: 30.2 },
  ],
  addEmployee: (e) => set((s) => ({ employees: [...s.employees, { ...e, id: Date.now() }] })),
  updateEmployee: (e) => set((s) => ({ employees: s.employees.map((x) => (x.id === e.id ? e : x)) })),
  deleteEmployee: (id) => set((s) => ({ employees: s.employees.filter((x) => x.id !== id) })),

  // Contractors (физлица / самозанятые)
  contractors: [
    { id: 1, lastname: 'Фёдоров', firstname: 'Алексей', middlename: '', type: 'НПД', taxRate: 0, unit: 'часы', rate: 2500 },
    { id: 2, lastname: 'Гришин', firstname: 'Игорь', middlename: 'Петрович', type: 'ГПХ', taxRate: 13, unit: 'дни', rate: 12000 },
  ],
  addContractor: (c) => set((s) => ({ contractors: [...s.contractors, { ...c, id: Date.now() }] })),
  updateContractor: (c) => set((s) => ({ contractors: s.contractors.map((x) => (x.id === c.id ? c : x)) })),
  deleteContractor: (id) => set((s) => ({ contractors: s.contractors.filter((x) => x.id !== id) })),

  // Subcontractors (юрлица)
  subcontractors: [
    { id: 1, inn: '7709876543', name: 'ООО "ДизайнПро"', fio: 'Захарова Л.И.', email: 'info@designpro.ru', phone: '+7 (499) 765-43-21' },
  ],
  addSubcontractor: (c) => set((s) => ({ subcontractors: [...s.subcontractors, { ...c, id: Date.now() }] })),
  updateSubcontractor: (c) => set((s) => ({ subcontractors: s.subcontractors.map((x) => (x.id === c.id ? c : x)) })),
  deleteSubcontractor: (id) => set((s) => ({ subcontractors: s.subcontractors.filter((x) => x.id !== id) })),

  // Equipment
  equipment: [
    { id: 1, name: 'Сервер Dell R740', desc: 'Вычислительный сервер', acqType: 'Собственное', opCost: 0, unit: 'дни', rate: 500 },
    { id: 2, name: 'Adobe CC лицензия', desc: 'Пакет дизайн-инструментов', acqType: 'В аренде', opCost: 3000, unit: 'месяц', rate: 5000 },
  ],
  addEquipment: (e) => set((s) => ({ equipment: [...s.equipment, { ...e, id: Date.now() }] })),
  updateEquipment: (e) => set((s) => ({ equipment: s.equipment.map((x) => (x.id === e.id ? e : x)) })),
  deleteEquipment: (id) => set((s) => ({ equipment: s.equipment.filter((x) => x.id !== id) })),

  // Projects
  projects: [
    {
      id: 1,
      name: 'CRM-система для клиента',
      start: '2024-02-01',
      end: '2024-07-31',
      status: 'В работе',
      customerId: 1,
      desc: 'Разработка CRM с интеграцией в 1С',
      taxRate: 20,
      resources: [
        { id: 1, name: 'Backend-разработка', type: 'Сотрудник', executorId: 1, qty: 60, cost: 0, margin: 30 },
        { id: 2, name: 'UI/UX дизайн', type: 'Исполнитель', executorId: 1, qty: 80, cost: 0, margin: 25 },
      ],
    },
  ],
  addProject: (p) => set((s) => ({ projects: [...s.projects, { ...p, id: Date.now() }] })),
  updateProject: (p) => set((s) => ({ projects: s.projects.map((x) => (x.id === p.id ? p : x)) })),
  deleteProject: (id) => set((s) => ({ projects: s.projects.filter((x) => x.id !== id) })),

  // Users
  users: [
    { id: 1, lastname: 'Иванов', firstname: 'Алексей', middlename: 'Викторович', email: 'admin@ics.ru', position: 'Директор', roles: ['Глобальный администратор', 'Коммерческий директор'] },
  ],
  addUser: (u) => set((s) => ({ users: [...s.users, { ...u, id: Date.now() }] })),
  deleteUser: (id) => set((s) => ({ users: s.users.filter((x) => x.id !== id) })),

  // Calculation helpers
  calcResourceCost: (resource) => {
    const s = get();
    const { type, executorId, qty, cost } = resource;
    if (type === 'Сотрудник') {
      const emp = s.employees.find((e) => e.id === executorId);
      if (!emp) return 0;
      const dayRate = emp.salary / 21;
      return dayRate * (qty || 0) * (1 + emp.taxRate / 100);
    }
    if (type === 'Исполнитель') {
      const con = s.contractors.find((c) => c.id === executorId);
      if (!con) return 0;
      return con.rate * (qty || 0) * (1 + con.taxRate / 100);
    }
    if (type === 'Оборудование') {
      const eq = s.equipment.find((e) => e.id === executorId);
      if (!eq) return 0;
      return eq.rate * (qty || 0);
    }
    if (type === 'Субподрядчик') {
      return cost || 0;
    }
    return 0;
  },
}));

export default useStore;
