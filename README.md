# esql-online-compiler
🚧 WORKING IN PROGRESS 🚧

Repositório GIT de um projeto de experimentação da linguagem Extended Structured Query Language (ESQL) do produto IBM App Connect Enterprise. O projeto utiliza um compilador online com o objetivo de acelerar a compreensão e domínio da linguagem, proporcionando um ambiente interativo para aprendizado e desenvolvimento.

O projeto é composto de:
* WebSocket
   * porta 8080
* docker-compose.yml com a imagem https://hub.docker.com/r/ibmcom/ace/
* Ace Server
   * porta administrativa 7600
   * porta de execução http 7800
* Site
   * conecta com o websocket para compilar o código ESQL e faz chamadas XHR na localhost:7600 para computar a entrada e saída de payload

Para executar o projeto:
1. Clone este repositório (https://github.com/manoger/esql-online-compiler)
2. Baixe as depencias node via `npm i`
3. Suba o websocket `node .\websocket-docker.js`
  * Necessário ter docker e docker-compose instalado.
4. Acesse o site index.html
  * É possivel testar sem subir o websocket 

Aparencia atual:

![image](https://github.com/manoger/esql-online-compiler/assets/29717626/88a60477-d5ab-4408-a64c-3039f5bd206e)

Aparencia atual sem `styles.css`:

![image](https://github.com/manoger/esql-online-compiler/assets/29717626/22bc9272-4688-442f-bd62-aa794802b37a)
