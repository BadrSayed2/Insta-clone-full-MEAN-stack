function generateUsername(firstName, lastName) {
  const fn = (firstName || "").trim().toLowerCase();
  const ln = (lastName || "").trim().toLowerCase();

  const random = Math.floor(100000 + Math.random() * 900000);

  return `${fn}${ln}${random}`;
}

module.exports = generateUsername;