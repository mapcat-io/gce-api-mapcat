// var Crate = require('../../crate.js');
  var stub = require('../v2/v2_stubs.js');

// TODO: Improve performance of this query
var db = initCrate();

exports = module.exports = function (req, res) {

  var data = req.query

  if (data.t === 'profile' && data.u) {
    var itemsToDevicesQuery = db.Query('SELECT item_id from items_to_devices where upper(device_id) = ?');
    var params = [data.u.toUpperCase()];

    itemsToDevicesQuery.execute(params, function (err, itemsToDevicesResponse) {
      if (err) {
        var message = 'Error retrieving user item stats from items_to_devices: ' + JSON.stringify(err)
        console.log(message)
        res.json({
          response: message
        })
      } else {

        console.log('Retrieved user item relations')
        var countItemId = itemsToDevicesResponse.rows.length;

        if (!countItemId) {
          res.json({items: [{
            '_id': data.u,
            'count': 0,
            'places': [] }]
          })
          return;
        }

        var itemHashes = [];
        var wherePart = '?';
        for (var i = 0; i < countItemId; i++) {
          var itemId = itemsToDevicesResponse.rows[i][0]
          itemHashes.push(itemId)
          // Make where part.
          // From second element and to end.
          if (i > 0) {
            wherePart += ',?';
          }
        }

        var itemsV6QueryString = 'SELECT lochash, locname from items_v6 where (item_hash IN (' +wherePart+ '))';
        var itemsV6Query = db.Query(itemsV6QueryString);


        itemsV6Query.execute(itemHashes, function (err, itemsV6Response) {
          if (err) {
            var message = 'Error retrieving user item stats from items_big: ' + JSON.stringify(err)
            console.log(message)
            res.json({
              response: message
            })
          } else {
            console.log('Retrieved user item stats')
            var itemsCount = itemsV6Response.rows.length;
            // var locationHashes = [];
            var locationNames = [];
            for (var i = 0; i < itemsCount; i++) {
              // var lochash = itemsV6Response.rows[i][0];
              var locname = itemsV6Response.rows[i][1];
              // if (locationHashes.indexOf(lochash) === -1) {
              //   locationHashes.push(lochash);
              // }
              if (locationNames.indexOf(locname) === -1) {
                locationNames.push(locname);
              }
            }
            // Sort.
            locationNames.sort();

            res.json({items: [{
              '_id': data.u,
              'count': itemsCount,
              'places': locationNames }]
            })

          }
        }) // End ItemsV6query.execute().

      } // End success itemsToDevicesquery.execute().
    }) // End itemsToDevicesquery.execute().

  } else {
    res.json(stub.itemStats())
  }

}
