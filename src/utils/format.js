export function fmt(n) {
  return "Rp " + Number(n).toLocaleString("id-ID");
}

export function fmtK(n) {
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}jt`;
  if (n >= 1000) return `Rp ${Math.round(n / 1000)}K`;
  return fmt(n);
}

export function escapeHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
