var Crate = require('../../crate.js');

// TODO: return array of objects not an array of arrays.
var db = initCrate(),
    topThingsTable = db.Query('SELECT * FROM top_things LIMIT 1000');

exports = module.exports = function(req, res) {

  topThingsTable.execute(function(err, response) {
    if (err) {
      console.log('Error retrieving top_things: ' + JSON.stringify(err));
      res.json({
        response: 'Error retrieving top_things: ' + JSON.stringify(err)
      });
    } else {
      console.log('Retrieved top_things.');

      var responseItems = [];
      for (i = 0; i < response.rows.length; i++) {
        var item = response.rows[i];
        var obj = {
          "name": item[0],
          "category": {
            "thing": item[1]
          }
        }
        responseItems.push(obj);
      };
      res.json({
        items: responseItems
      });
    }
  });

}
