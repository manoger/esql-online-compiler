const WebSocket = require('ws');
const vm = require('vm');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Cliente conectado.');

  ws.on('message', (message) => {
    console.log('Recebido:', message);

    try {
      const command = message.toString();
      // Cria um contexto de execução isolado
      const sandbox = {};

      // Avalia o código JavaScript no contexto criado
      vm.createContext(sandbox);
      const result = vm.runInContext(`eval(${command})`, sandbox);

      // Envia o resultado de volta para o cliente
      ws.send(result.toString());
    } catch (error) {
      // Se ocorrer um erro, envia uma mensagem de erro de volta para o cliente
      ws.send('Erro: ' + error.message);
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado.');
  });
});

console.log('Servidor WebSocket está ouvindo na porta 8080.');
