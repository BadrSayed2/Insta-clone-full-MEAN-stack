function generateCode() {
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += Math.floor(Math.random() * 10); 
  }
  return code;
}

module.exports = generateCode