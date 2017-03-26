var async = require('async'),
    Crate = require('../../crate.js'),
    md5 = require('md5');

var db = initCrate(),
    selectStr = "SELECT lochash, MAX(CONCAT(_score,'-',name)) AS name, ARBITRARY(locname) AS locname, ARBITRARY(lat) as lat, ARBITRARY(lng) as lng, " +
      "MAX(_score * (6000 - DISTANCE(lat_lng, [$1, $2]))) AS scored_dist, ARBITRARY(DISTANCE(lat_lng, [$1, $2])) AS distance " +
      "FROM items_v4_test2 " +
      "WHERE MATCH((name_ft 0.75, locname_ft 3.0, cattext_ft 5.0) , $3) USING best_fields AND DISTANCE(lat_lng, [$1, $2]) < 4828 " +
      "GROUP BY lochash ORDER BY scored_dist DESC limit 20",

    query = db.Query(selectStr);

exports = module.exports = function(req, res) {

  var q = req.query.q.trim().toLowerCase() || '', // search term
      u = req.query.u || '', // ios deviceId
      lat = req.query.lat || '',
      lng = req.query.long || '',
      items_returned;

  async.series( [
    // Get the first table contents
    function ( callback ) {

      query.execute([parseFloat(lng), parseFloat(lat), q], function(err, res) {

        if (err) {
          //console.log(err.statusCode);
        }

        if (res != null) {
          items_returned = res.rows;
        } else {
          items_returned = [];
        }
        callback();
      });

    }

  // Send the response
  ], function ( error, results ) {

    var modifiedItems = {};

    for (var i = 0, len = items_returned.length; i < len; i++) {
      var mds = items_returned[i][0],
          things_name = items_returned[i][1].substr(items_returned[i][1].indexOf('-') + 1);
      if (!(mds in modifiedItems)) {
        modifiedItems[mds] = {
          _id: {
            name: items_returned[i][2]
          },
          coordinates: [items_returned[i][4], items_returned[i][3]],
          things: [things_name],
          distance: [items_returned[i][6]],
          location: {
            name: items_returned[i][2],
	    lochash: items_returned[i][0]
          }
        };
      } else {
        modifiedItems[mds].things.push(things_name);
        modifiedItems[mds].coordinates.push([items_returned[i][4], items_returned[i][3]]);
        modifiedItems[mds].distance.push(items_returned[i][6]);
      }
    }

    var responseItems=[];

    for (var key in modifiedItems) {
      if (modifiedItems.hasOwnProperty(key)) {
        responseItems.push(modifiedItems[key]);
      }
    }

    res.json({
      'items' : responseItems
    });

  });

};
