export const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

// export const normalizeAssetUrl = (path) => {
//   if (!path) return '';
//   const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
//   const origin = apiBase.replace(/\/api\/?$/, '');
//   const normalized = String(path).replaceAll('\\', '/').replace(/^\/+/, '');
//   return `${origin}/${normalized}`;
// };
export function normalizeAssetUrl(filePath) {
  if (!filePath) return "";

  const normalized = String(filePath)
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const origin = apiBase.replace(/\/api\/?$/, "");

  return `${origin}/${normalized}`;
}