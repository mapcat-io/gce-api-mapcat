var express = require('express'),
    router = express.Router();

// Middleware specific to api router
router.use(function(req, res, next) {
  console.log('Views middleware.');
  next();
});

// Import views routes
// TODO: refactor to initialize routes in api folder according to [Directory].[FILENAME]
var views = {
	dcma: require('./views/dcma'),
	index: require('./views/index'),
	merchants: require('./views/merchants'),
	privacy: require('./views/privacy'),
	terms: require('./views/terms')
};

// View routes
router.get('/', views.index);
router.get('/dcma', views.dcma);
router.get('/merchants', views.merchants);
router.get('/privacy', views.privacy);
router.all('/terms', views.terms);

module.exports = router;
