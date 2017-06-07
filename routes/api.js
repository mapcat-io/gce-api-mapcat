var express = require('express'),
    moment = require('moment'),
    router = express.Router();

// Middleware specific to api router
router.use(function(req, res, next) {
  console.log('API middleware.');
  // allows api/v2 endpoints to pass without token, otherwise requires valid token
  var data = req.query || '';
  if (!(req.originalUrl.includes("api/v2") || req.originalUrl.includes("api/v2.5")) && data.token !== process.env.API_KEY) {
    var message = 'Not authorized to access this endpoint without valid credentials.'
    console.log(message);
    res.json({
      response: message
    });
  }
  next();
});

// Import api routes
// TODO: refactor to initialize routes in api folder according to [Directory].[FILENAME]
var api = {
  v2: {
    // backwards compatible api endpoints
    item_stats: require('./api/v2/item_stats'),
    items_in_place: require('./api/v2/items_in_place'),
    items: require('./api/v2/items'),
    places: require('./api/v2/places'),
    post_feedback: require('./api/v2/post_feedback'),
    post_items: require('./api/v2/post_items'),
    top_things: require('./api/v2/top_things')
  },
  v2_5: {
    // backwards compatible api endpoints
    items_in_place: require('./api/v2_5/items_in_place'),
    items: require('./api/v2_5/items'),
    post_items: require('./api/v2_5/post_items')
  }
};

// V2 API routes
router.get('/v2/item-stats', api.v2.item_stats);
router.get('/v2/items-in-place', api.v2.items_in_place);
router.get('/v2/items', api.v2.items);
router.get('/v2/places', api.v2.places);
router.all('/v2/post-feedback', api.v2.post_feedback);
router.post('/v2/post-items', api.v2.post_items);
router.get('/v2/top-things', api.v2.top_things);

// V2.5 API routes
router.get('/v2.5/items-in-place', api.v2_5.items_in_place);
router.get('/v2.5/items', api.v2_5.items);
router.post('/v2.5/post-items', api.v2_5.post_items);

module.exports = router;
