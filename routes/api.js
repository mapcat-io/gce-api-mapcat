var express = require('express'),
    moment = require('moment'),
    router = express.Router();

// Middleware specific to api router
router.use(function(req, res, next) {
  console.log('Initializing API middleware.');
  next();
});

// Import api routes
// TODO: refactor to initialize any routes in api folder according to [Directory].[FILENAME]
var api = {
  v2: {
    // backwards compatible api endpoints
    items: require('./api/v2/items')
  }
};

// V2 API routes
router.get('/v2/items', api.v2.items);

module.exports = router;
