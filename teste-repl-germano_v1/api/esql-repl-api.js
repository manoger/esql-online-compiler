const { exec } = require('child_process');
const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http'); // Add the http module
const AdmZip = require('adm-zip');

// Comando para iniciar o contêiner Docker
const dockerComposeCommand = 'docker-compose up --force-recreate -d';

// Caminhos dos diretórios e arquivos
const esqlReplDir = path.join(__dirname, 'BARfiles/buid/esql-repl');
const esqlReplZip = path.join(__dirname, 'BARfiles/buid/esql-repl.appzip');
const buidDir = path.join(__dirname, 'BARfiles/buid');
const buidBar = path.join(__dirname, 'BARfiles/buid.bar');
const computeEsqlFile = path.join(__dirname, 'BARfiles/buid/esql-repl/main_msgflow_Compute.esql');

// Function to zip a directory into a ZIP file
function zipDirectory(sourceDir, targetZip) {
  const zip = new AdmZip();
  zip.addLocalFolder(sourceDir);
  zip.writeZip(targetZip);
  console.log(`Files zipped to ${targetZip}`);
}

const app = express();
const PORT = 3000; // Change this to your desired port

// Middleware to parse plain text data in the request body
app.use(express.text());


// API endpoint to start Docker Compose
app.post('/api/start-docker', (req, res) => {
    const dockerProcess = exec(dockerComposeCommand);
    dockerProcess.stdout.on('data', (data) => {
      console.log(`🐳 stdout: ${data}`);
    });
    dockerProcess.stderr.on('data', (data) => {
      console.error(`🐋 stderr: ${data}`);
    });
    dockerProcess.on('close', (code) => {
      console.log(`🐋 close: ${code}`);
      if (code === 0) {
        console.log('🎇 Docker Compose started successfully');
        res.status(201).json({ message: 'Docker Compose started successfully' });
      } else {
        console.error('🧨 Failed to start Docker Compose');
        res.status(422).json({ message: 'Failed to start Docker Compose' });
      }
    });
  });
  
  // API endpoint to write and zip the ".bar" file
  app.post('/api/write-zip-bar', (req, res) => {
    // Read the input data from the request body (assumed to be plain text)
    const message = req.body;
  
    // Sobrescreve o arquivo ESQL com o texto de entrada
    fs.writeFile(computeEsqlFile, message, (err) => {
      if (err) {
        console.error(`Error writing ESQL file: ${err}`);
        res.status(422).json({ message: 'Error writing ESQL file' });
        return;
      }
      console.log(`ESQL file overwritten successfully.`);
  
      // Compactar o diretório esql-repl em um arquivo ZIP
      zipDirectory(esqlReplDir, esqlReplZip);
      // Compactar o diretório buid em um arquivo BAR
      zipDirectory(buidDir, buidBar);
  
      // Make the HTTP request to the specified URL
      const options = {
        hostname: 'localhost',
        port: 7600,
        path: '/apiv2/deploy',
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream', // Define o tipo de conteúdo como octet-stream
          'Accept': 'application/json'
        },
      };
  
      const reqHttp = http.request(options, (resHttp) => {
        let responseData = '';
  
        resHttp.on('data', (chunk) => {
          responseData += chunk;
        });
  
        resHttp.on('end', () => {
          // Parse the JSON response from the remote server if needed
          let jsonResponse;
          try {
            jsonResponse = JSON.parse(responseData);
          } catch (error) {
            console.error(`Error parsing JSON response: ${error.message}`);
            res.status(500).json({ message: 'Error parsing JSON response' });
            return;
          }
  
          res.status(200).json(jsonResponse); // Send the JSON response to the client
        });
      });
  
      // Read the content of the .bar file and send it as the body of the HTTP request
      fs.readFile(buidBar, (err, data) => {
        if (err) {
          console.error(`Error reading .bar file: ${err.message}`);
          res.status(422).json({ message: 'Error reading .bar file' });
          return;
        }
  
        // Set the Content-Length header
        options.headers['Content-Length'] = data.length;
  
        // Send the content of the .bar file as the body of the HTTP request
        reqHttp.write(data);
  
        // End the HTTP request
        reqHttp.end();
      });
    });
  });

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
