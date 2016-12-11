var Crate = require('../../crate.js');

// TODO: Improve performance of this query
var db = initCrate(),
    query = db.Query('SELECT j, loc_name FROM items_big WHERE j like ? LIMIT 10');

exports = module.exports = function(req, res) {

  var data = req.query,
      params = ['%' + data.u.toLowerCase() + '%'];

  query.execute(params, function(err, response) {
    if (err) {
      var message = 'Error retrieving user item stats: ' + JSON.stringify(err);
      console.log(message);
      res.json({
        response: message
      });
    } else {
      console.log('Retrieved user item stats.');

      var responseItems = [];
      var count = response.rows.length;
      for (i = 0; i < count; i++) {
        responseItems.push(response.rows[i][1]);
      };

      res.json({
        items: [
          {
            "_id": data.u,
            "count": count,
            "places": responseItems
          }
        ]
      });
    }
  });

}
