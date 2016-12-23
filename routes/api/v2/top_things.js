var Crate = require('../../crate.js');

var db = initCrate(),
    query = db.Query('SELECT * FROM top_things LIMIT 1000');

exports = module.exports = function(req, res) {

  query.execute(function(err, response) {
    if (err) {
      var message = 'Error retrieving top_things: ' + JSON.stringify(err);
      console.log(message);
      res.json({
        response: message
      });
    } else {
      console.log('Retrieved top_things.');

      var responseItems = [];
      for (i = 0; i < response.rows.length; i++) {
        var item = response.rows[i];
        var obj = {
          "name": item[2],
          "category": {
            "thing": item[0]
          }
        };
        responseItems.push(obj);
      };
      res.json({
        items: responseItems
      });
    }
  });

}
