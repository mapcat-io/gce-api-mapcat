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
    items: require('./api/v2/items'),
    items_in_place: require('./api/v2/items_in_place'),
    places: require('./api/v2/places'),
    top_things: require('./api/v2/top_things'),
    post_feedback: require('./api/v2/post_feedback')
    // post_items: require('./api/v2/post_items'),
    // item_stats: require('./api/v2/item_stats'),
  },
  v2_5: {
    // backwards compatible api endpoints
    items: require('./api/v2_5/items'),
    items_in_place: require('./api/v2_5/items_in_place'),
    post_items: require('./api/v2_5/post_items'),
    item_stats: require('./api/v2_5/item_stats')
  },
  v2_6: {
    // backwards compatible api endpoints
    items: require('./api/v2_6/items'),
    items_in_place: require('./api/v2_6/items_in_place'),
    post_items: require('./api/v2_6/post_items'),
    item_stats: require('./api/v2_6/item_stats')
  }
};

// V2 API routes
router.get('/v2/items', api.v2.items);
router.get('/v2/items-in-place', api.v2.items_in_place);
router.post('/v2/post-items', api.v2_6.post_items);
router.get('/v2/item-stats', api.v2_6.item_stats);
router.get('/v2/places', api.v2.places);
router.get('/v2/top-things', api.v2.top_things);
router.all('/v2/post-feedback', api.v2.post_feedback);

// V2.5 API routes
router.get('/v2.5/items', api.v2_5.items);
router.get('/v2.5/items-in-place', api.v2_5.items_in_place);
router.post('/v2.5/post-items', api.v2_5.post_items);
router.get('/v2.5/item-stats', api.v2_5.item_stats);

// V2.6 API routes
router.get('/v2.6/items', api.v2_6.items);
router.get('/v2.6/items-in-place', api.v2_6.items_in_place);
router.post('/v2.6/post-items', api.v2_6.post_items);
router.get('/v2.6/item-stats', api.v2_6.item_stats);

module.exports = router;
