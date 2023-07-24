const WebSocket = require('ws');
const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const AdmZip = require('adm-zip');
// Comando para iniciar o contêiner Docker
const dockerComposeCommand = 'docker-compose up --force-recreate -d';

// Configurações da requisição HTTP
const options = {
    hostname: 'localhost',
    port: 7600,
    path: '/apiv2/deploy',
    method: 'POST',
    headers: {
        'Content-Type': 'application/octet-stream', // Define o tipo de conteúdo como octet-stream
    },
};
// Função para compactar um diretório em um arquivo ZIP
function zipDirectory(sourceDir, targetZip) {
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
const computeEsqlFile = 'BARfiles/buid/esql-repl/main_msgflow_Compute.esql';
// Cria o servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 });


wss.on('listening', () => {
    const dockerProcess = exec(dockerComposeCommand);
    dockerProcess.stdout.on('data', (data) => {
        console.log(`🐳 stdout: ${data}`);
    });
    dockerProcess.stderr.on('data', (data) => {
        console.error(`🐋 stderr: ${data}`);
    });
    dockerProcess.on('close', (code) => {
        console.log(`🐋 close: ${code}`);
        if(code==0)
            console.log('🎇 comando "',dockerComposeCommand,'" executado com sucesso');
        else
            console.error('🧨 comando "',dockerComposeCommand,'" executado com falha'); 
    });
    
    // Encerrar o processo Docker Compose quando o servidor WebSocket for encerrado
    wss.on('close', () => {
        dockerProcess.kill();
    });
});

wss.on('connection', (ws) => {
    console.log('Cliente conectado.');
    ws.on('message', (message) => {
        // Sobrescreve o arquivo ESQL com o texto de entrada
        fs.writeFile(computeEsqlFile, message, (err) => {
            if (err) {
                console.error(`Erro ao sobrescrever o arquivo ESQL: ${err}`);
                return;
            }
            console.log(`Arquivo ESQL sobrescrito com sucesso.`);
            // Compactar o diretório esql-repl em um arquivo ZIP
            zipDirectory(esqlReplDir, esqlReplZip);
            // Compactar o diretório buid em um arquivo BAR
            zipDirectory(buidDir, buidBar);
            // Lê o arquivo .bar compilado
            fs.readFile(buidBar, (err, data) => {
                if (err) {
                    console.error(`Erro ao ler o arquivo .bar: ${err.message}`);
                    return;
                }
                // Configura o tamanho do corpo da requisição
                options.headers['Content-Length'] = data.length;
                // Cria a requisição HTTP
                const req = http.request(options, (res) => {
                    let responseData = '';

                    res.on('data', (chunk) => {
                        responseData += chunk;
                    });

                    res.on('end', () => {
                        ws.send(responseData);
                    });
                });
                // Envia o conteúdo do arquivo como corpo da requisição
                req.write(data);
                // Encerra a requisição
                req.end();
            });
        });
    });
    ws.on('close', () => {
        console.log('Cliente desconectado.');
    });
});
console.log('Servidor WebSocket iniciado na porta 8080.');
