var Crate = require('cratejs');

initCrate = function () {
  console.log('Initializing Crate DB.');
  var db = new Crate({
    host: process.env.CRATE_HOST || '127.0.0.1',
    port: process.env.CRATE_PORT || 4200,
    cluster: [
        {
          host: process.env.CRATE_HOST || '127.0.0.1',
          port: process.env.CRATE_PORT || 4200
        },
    ]
  });
  return db;
};
