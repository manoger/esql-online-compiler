const fs = require('fs');
const AdmZip = require('adm-zip');

const zipDirectory = (sourceDir, targetZip) => {
  const zip = new AdmZip();
  zip.addLocalFolder(sourceDir);
  zip.writeZip(targetZip);
  console.log(`Arquivos compactados em ${targetZip}`);
};

// Caminhos dos diretórios e arquivos
const esqlReplDir = 'BARfiles/buid/esql-repl';
const esqlReplZip = 'BARfiles/buid/esql-repl.appzip';
const buidDir = 'BARfiles/buid';
const buidBar = 'BARfiles/buid.bar';

// Compactar o diretório esql-repl em um arquivo ZIP
zipDirectory(esqlReplDir, esqlReplZip);

// Compactar o diretório buid em um arquivo BAR
zipDirectory(buidDir, buidBar);
