export const USERS = [
  // Starter
  { id: "U1", username: "demo", password: "demo123", name: "Demo User", email: "demo@lapservpro.com", role: "admin", plan: "starter", avatar: "\uD83D\uDC64" },
  { id: "U2", username: "starter", password: "starter123", name: "Andi Starter", email: "andi@lapservpro.com", role: "technician", plan: "starter", avatar: "\uD83D\uDC68\u200D\uD83D\uDD27" },

  // Pro
  { id: "U3", username: "pro", password: "pro123", name: "Budi Profesional", email: "budi@lapservpro.com", role: "admin", plan: "pro", avatar: "\uD83D\uDC68\u200D\uD83D\uDCBB" },
  { id: "U4", username: "admin", password: "admin123", name: "Sari Admin", email: "sari@lapservpro.com", role: "admin", plan: "pro", avatar: "\uD83D\uDC69\u200D\uD83D\uDCBC" },
  { id: "U5", username: "teknisi", password: "teknisi123", name: "Hendra Teknisi", email: "hendra@lapservpro.com", role: "technician", plan: "pro", avatar: "\uD83D\uDC68\u200D\uD83D\uDD27" },

  // Enterprise
  { id: "U6", username: "enterprise", password: "enterprise123", name: "Diana Enterprise", email: "diana@lapservpro.com", role: "owner", plan: "enterprise", avatar: "\uD83D\uDC69\u200D\uD83D\uDCBB" },
  { id: "U7", username: "owner", password: "owner123", name: "Rudi Owner", email: "rudi@lapservpro.com", role: "owner", plan: "enterprise", avatar: "\uD83D\uDC68\u200D\uD83D\uDCBC" },
];

export const ROLE_LABELS = {
  admin: "Administrator",
  technician: "Teknisi",
  owner: "Owner",
};
