const fetch = require('node-fetch');

function paginateArray(array) {
  return new Promise(function(resolve, reject) {
    resolve(array.map(() => array.splice(0, 10)).filter(a => a));
  });
}

module.exports = {
  paginateArray: paginateArray
}