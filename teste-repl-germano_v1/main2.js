const vm = require('vm');

const sandbox = {};

vm.createContext(sandbox);

const code = '1 + 1';
const result = vm.runInContext(`eval(${code})`, sandbox);

console.log(result);
