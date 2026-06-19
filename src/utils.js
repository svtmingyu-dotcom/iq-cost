export const fmt = (n) =>
  Math.round(n).toLocaleString('ru-RU') + ' ₽';

export const fmtNum = (n) =>
  Math.round(n).toLocaleString('ru-RU');

export const calcFinal = (cost, margin) =>
  cost * (1 + (margin || 0) / 100);

export const RESOURCE_TYPES = ['Сотрудник', 'Исполнитель', 'Субподрядчик', 'Оборудование'];

export const PROJECT_STATUSES = ['Новый', 'В работе', 'На паузе', 'Завершён'];

export const CUSTOMER_TYPES = ['Физическое лицо', 'Индивидуальный предприниматель', 'Юридическое лицо'];

export const CONTRACT_TYPES = ['НПД', 'ГПХ'];

export const UNITS = ['часы', 'дни', 'полная стоимость'];

export const ACQ_TYPES = ['Собственное', 'В аренде'];

export const ALL_ROLES = [
  'Глобальный администратор',
  'Коммерческий директор',
  'Бухгалтер',
  'Кадровик',
];

export const statusBadge = (status) => {
  const map = {
    'Новый': 'badge-gray',
    'В работе': 'badge-blue',
    'На паузе': 'badge-amber',
    'Завершён': 'badge-green',
  };
  return map[status] || 'badge-gray';
};

export const initials = (lastname, firstname) =>
  `${(lastname || '')[0] || ''}${(firstname || '')[0] || ''}`.toUpperCase();
