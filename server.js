var bodyParser = require('body-parser');

// Load .env variables
require('dotenv').load();

// Base
var express = require('express'),
    app = express(),
    port = process.env.SERVER_PORT || 3911;

app.use(express.static('public'));
app.use( bodyParser.json() );

// Import routes
var routes = {
  api: require('./routes/api'),
  views: require('./routes/views')
};

// Routes
app.use('/', routes.views);
app.use('/api', routes.api);

// Start server
app.listen(port);
console.log('Starting GCE mapcat server on port ' + port);
