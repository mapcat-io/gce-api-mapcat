var express = require('express'),
    router = express.Router();

// Routes
router.get('/', function (req, res) {
  res.json('GCE Mapcat Server');
});

module.exports = router;
