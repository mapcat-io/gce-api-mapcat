var Crate = require('../../crate.js'),
    stub = require('./v2_stubs.js');

// TODO: Improve performance of this query
var db = initCrate();

exports = module.exports = function(req, res) {

  var data = req.query;

  if (data.t === 'profile' && data.u) {
    var query = db.Query('SELECT j, loc_name FROM items_big WHERE j like ?'),
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

        var responseItems = [],
            count = response.rows.length;
            
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

  } else {
    res.json(stub.itemStats());
  };

}
