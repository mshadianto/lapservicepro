export function fmt(n) {
  return "Rp " + Number(n).toLocaleString("id-ID");
}

export function escapeHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
