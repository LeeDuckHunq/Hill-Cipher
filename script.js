document.getElementById('encryptBtn').addEventListener('click', encrypt);
document.getElementById('decryptBtn').addEventListener('click', decrypt);

function getMatrixK() {
  return [
    [parseInt(document.getElementById('k11').value), parseInt(document.getElementById('k12').value)],
    [parseInt(document.getElementById('k21').value), parseInt(document.getElementById('k22').value)]
  ];
}

function encrypt() {
  let inputString = document.getElementById('inputString').value.toUpperCase().replace(/[^A-Z]/g, '');
  if (inputString.length % 2 !== 0) inputString += inputString[inputString.length - 1];
  const matrixK = getMatrixK();
  const encryptedResult = matrixEncrypt(inputString, matrixK);
  document.getElementById('result').innerText = `Encrypted: ${encryptedResult}`;
}

function decrypt() {
  let inputString = document.getElementById('inputString').value.toUpperCase().replace(/[^A-Z]/g, '');
  const matrixK = getMatrixK();
  const decryptedResult = matrixDecrypt(inputString, matrixK);
  document.getElementById('result').innerText = `Decrypted: ${decryptedResult}`;
}

function matrixEncrypt(text, matrixK) {
    let encryptedText = '';
    let processLog = "Encryption Process:\n\n";
  
    processLog += "Key Matrix:\n";
    processLog += `| ${matrixK[0][0]} ${matrixK[0][1]} |\n`;
    processLog += `| ${matrixK[1][0]} ${matrixK[1][1]} |\n\n`;
  
    for (let i = 0; i < text.length; i += 2) {
      const char1 = text[i];
      const char2 = text[i + 1];
      const p1 = char1.charCodeAt(0) - 65;
      const p2 = char2.charCodeAt(0) - 65;
  
      processLog += `Original Pair: ${char1}${char2} → [${p1}, ${p2}]\n`;
      
      processLog += `Multiplication:\n`;
      processLog += `C1 = (${matrixK[0][0]} * ${p1}) + (${matrixK[0][1]} * ${p2}) mod 26\n`;
      processLog += `C2 = (${matrixK[1][0]} * ${p1}) + (${matrixK[1][1]} * ${p2}) mod 26\n`;
  
      const c1 = mod(matrixK[0][0] * p1 + matrixK[0][1] * p2, 26);
      const c2 = mod(matrixK[1][0] * p1 + matrixK[1][1] * p2, 26);
  
      processLog += `Encrypted Pair: [${c1}, ${c2}] → ${String.fromCharCode(c1 + 65)}${String.fromCharCode(c2 + 65)}\n\n`;
  
      encryptedText += String.fromCharCode(c1 + 65) + String.fromCharCode(c2 + 65);
    }
  
    processLog += `Ciphertext: ${encryptedText}\n`;
  
    console.log(processLog);
    document.getElementById('process').innerText = processLog;
    return encryptedText;
}
  
function matrixDecrypt(text, matrixK) {
    const determinant = matrixK[0][0] * matrixK[1][1] - matrixK[0][1] * matrixK[1][0];
    if (determinant === 0) return "Khóa không hợp lệ (định thức của ma trận là 0)";
  
    const inverseDet = modInverse(determinant, 26);
    if (inverseDet === null) return "Khóa không hợp lệ (không có nghịch đảo)";
  
    const inverseK = [
      [mod(matrixK[1][1] * inverseDet, 26), mod(-matrixK[0][1] * inverseDet, 26)],
      [mod(-matrixK[1][0] * inverseDet, 26), mod(matrixK[0][0] * inverseDet, 26)]
    ];
  
    let decryptedText = '';
    let processLog = "Decryption Process:\n\n";
  
    processLog += "Inverse Key Matrix (mod 26):\n";
    processLog += `| ${inverseK[0][0]} ${inverseK[0][1]} |\n`;
    processLog += `| ${inverseK[1][0]} ${inverseK[1][1]} |\n\n`;
  
    for (let i = 0; i < text.length; i += 2) {
      const char1 = text[i];
      const char2 = text[i + 1];
      const c1 = char1.charCodeAt(0) - 65;
      const c2 = char2.charCodeAt(0) - 65;
  
      processLog += `Encrypted Pair: [${char1}${char2}] → [${c1}, ${c2}]\n`;
      
      processLog += `Multiplication:\n`;
      processLog += `P1 = (${inverseK[0][0]} * ${c1}) + (${inverseK[0][1]} * ${c2}) mod 26\n`;
      processLog += `P2 = (${inverseK[1][0]} * ${c1}) + (${inverseK[1][1]} * ${c2}) mod 26\n`;
  
      const p1 = mod(inverseK[0][0] * c1 + inverseK[0][1] * c2, 26);
      const p2 = mod(inverseK[1][0] * c1 + inverseK[1][1] * c2, 26);
  
      processLog += `Decrypted Pair: [${p1}, ${p2}] → ${String.fromCharCode(p1 + 65)}${String.fromCharCode(p2 + 65)}\n\n`;
  
      decryptedText += String.fromCharCode(p1 + 65) + String.fromCharCode(p2 + 65);
    }
  
    processLog += `Plaintext: ${decryptedText}\n`;
  
    console.log(processLog);
    document.getElementById('process').innerText = processLog;
    return decryptedText.trim();
}
  

function modInverse(a, m) {
  a = mod(a, m);
  for (let x = 1; x < m; x++) {
    if (mod(a * x, m) === 1) return x;
  }
  return null;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}
