var Crate = require('../../crate.js')

var db = initCrate()
// query = db.Query('SELECT name FROM items_v5 WHERE lochash = ? LIMIT 1000');

exports = module.exports = function (req, res) {

  var data = req.query,
    lochash = data.lochash,
    typeId = parseInt(data.type_id),
    hr = parseInt(data.hr) || 0,
    whereTypeId = typeId ? ' AND type_id= ?' : '',
    query = db.Query("SELECT name FROM items_v6 WHERE lochash = ?" +whereTypeId+ " LIMIT 1000");

  query.execute([lochash, typeId], function (err, response) {
    if (err) {
      var message = 'Error retrieving items in place: ' + JSON.stringify(err)
      console.log(message)
      res.json({
        response: message
      });
      return;
    }

    console.log('Retrieved items in place.')

    var responseItems = []
    for (var i = 0; i < response.rows.length; i++) {
      var item = response.rows[i]
      responseItems.push(item[0])
    }

    var json = {
      items: [
        {
          'things': responseItems
        }
      ]
    }

    // Check hr and make human readable if set.
    if (hr === 1) {
      var str = '<pre>' + JSON.stringify(json, '', 4) + '</pre>'
      res.send(str)
    } else {
      res.json(json)
    }

  })

}
