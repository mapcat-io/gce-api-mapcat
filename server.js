var bodyParser = require('body-parser');

// Load .env variables
require('dotenv').load();

// Base
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3911;

app.use( bodyParser.json() );

// Import routes
var routes = {
  api: require('./routes/api'),
  index: require('./routes/index')
};

// Routes
app.use('/', routes.index);
app.use('/api', routes.api);

// Start server
app.listen(port);
console.log('Starting GCE mapcat server on port ' + port);
