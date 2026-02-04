// src/utils/formatters.ts
export const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('mn-MN').format(amount) + '₮';
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const formatPhone = (phone: string): string => {
  if (phone.length === 8) {
    return `${phone.slice(0, 4)}-${phone.slice(4)}`;
  }
  return phone;
};

export const formatRegisterNumber = (registerNumber: string): string => {
  if (registerNumber.length === 10) {
    return `${registerNumber.slice(0, 2)} ${registerNumber.slice(2)}`;
  }
  return registerNumber;
};

export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} өдрийн өмнө`;
  if (hours > 0) return `${hours} цагийн өмнө`;
  if (minutes > 0) return `${minutes} минутын өмнө`;
  return 'Саяхан';
};

export const getLoanStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    pending: 'Хүлээгдэж буй',
    approved: 'Зөвшөөрөгдсөн',
    active: 'Идэвхтэй',
    rejected: 'Татгалзсан',
    completed: 'Дууссан',
    defaulted: 'Төлбөр хоцорсон',
  };
  return statusMap[status] || status;
};

export const getLoanStatusColor = (status: string): string => {
  const colorMap: { [key: string]: string } = {
    pending: '#FFA502',
    approved: '#10AC84',
    active: '#2E86DE',
    rejected: '#EE5A6F',
    completed: '#95A5A6',
    defaulted: '#EE5A6F',
  };
  return colorMap[status] || '#95A5A6';
};