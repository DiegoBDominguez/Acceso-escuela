const forge = require('node-forge');
const fs = require('fs');
const path = require('path');

try {
  const pki = forge.pki;
  
  // Generar par de claves
  const keys = pki.rsa.generateKeyPair(2048);
  
  // Crear certificado autofirmado
  const cert = pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 1);
  
  const attrs = [{
    name: 'commonName',
    value: 'localhost'
  }, {
    name: 'organizationName',
    value: 'Preparatoria'
  }, {
    shortName: 'ST',
    value: 'Mexico'
  }, {
    shortName: 'C',
    value: 'MX'
  }];
  
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions([{
    name: 'basicConstraints',
    cA: true
  }, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true
  }, {
    name: 'extKeyUsage',
    serverAuth: true,
    clientAuth: true
  }, {
    name: 'subjectAltName',
    altNames: [
      { type: 2, value: 'localhost' },
      { type: 2, value: '127.0.0.1' },
      { type: 2, value: '192.168.101.110' }
    ]
  }]);
  
  // Autofirmar el certificado
  cert.sign(keys.privateKey, forge.md.sha256.create());
  
  // Guardar archivos
  const certsDir = path.join(__dirname, 'certs');
  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir);
  }
  
  const pem = pki.certificateToPem(cert);
  const key = pki.privateKeyToPem(keys.privateKey);
  
  fs.writeFileSync(path.join(certsDir, 'server.cert'), pem);
  fs.writeFileSync(path.join(certsDir, 'server.key'), key);
  
  console.log('✅ Certificados generados correctamente en ./certs/');
  console.log('   - server.cert');
  console.log('   - server.key');
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
