# esql-online-compiler
🚧 WORK IN PROGRESS 🚧

Repositório GIT de um projeto de experimentação da linguagem Extended Structured Query Language (ESQL) do produto IBM App Connect Enterprise. O projeto utiliza um compilador online com o objetivo de acelerar a compreensão e domínio da linguagem, proporcionando um ambiente interativo para aprendizado e desenvolvimento.

O projeto é composto de:
* API
   * port 3000
* https://hub.docker.com/r/ibmcom/ace/
* Ace Server
   * admin port 7600
   * http port 7800
* Website html

Para executar o projeto:
1. `git clone https://github.com/manoger/esql-online-compiler`
2. `npm i`
3. `node esql-repl-api.js`
  * requires: 
    * docker
    * docker-compose
4. Access `server-selection.html`

![image](https://github.com/manoger/esql-online-compiler/assets/29717626/7d1feb9f-ca04-4e18-b021-f9e715c61824)
![image](https://github.com/manoger/esql-online-compiler/assets/29717626/7826f323-00fd-4012-9a9b-dec46b005822)
![image](https://github.com/manoger/esql-online-compiler/assets/29717626/e79171e9-c112-426a-b423-ae12bb4c55cd)
![image](https://github.com/manoger/esql-online-compiler/assets/29717626/7c0a5843-6303-45bc-b311-c160c3e59122)

