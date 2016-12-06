var Crate = require('crate-connect');

initCrate = function () {
  console.log('Initializing Crate DB.');
  var db = new Crate({
    host: '127.0.0.1', //Defaults to localhost
    port: 4200, //Defaults to 4200
    // You can also send in a cluster of nodes
    cluster: [
        {
          host: '127.0.0.1',
          port:4200
        },
    ]
  });
  return db;
};
