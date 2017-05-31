var Crate = require('../../crate.js');

var db = initCrate(),
    query = db.Query('SELECT name FROM items_v4_test2 WHERE lochash = ? LIMIT 1000');

exports = module.exports = function(req, res) {

  var data = req.query,
      params = [data.lochash];
      
  query.execute(params, function(err, response) {
    if (err) {
      var message = 'Error retrieving items in place: ' + JSON.stringify(err);
      console.log(message);
      res.json({
        response: message
      });
    } else {
      console.log('Retrieved items in place.');

      var responseItems = [];
      for (i = 0; i < response.rows.length; i++) {
        var item = response.rows[i];
        responseItems.push(item[0]);
      };

      res.json({
        items: [
          {
            "things": responseItems
          }
        ]
      });
    }
  });

}
