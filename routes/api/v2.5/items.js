var async = require('async'),
    Crate = require('../../crate.js'),
    md5 = require('md5');

exports = module.exports = function(req, res) {

  var q = req.query.q.trim().toLowerCase() || '', // search term
      u = req.query.u || '', // ios deviceId
      lat = parseFloat(req.query.lat) || '',
      lng = parseFloat(req.query.long) || '',
      // Weight scores:
      name_ft = parseFloat(req.query.name_ft) || 0.75,
      locname_ft = parseFloat(req.query.locname_ft) || 3.0,
      cattext_ft = parseFloat(req.query.cattext_ft) || 5.0,
      match_type = req.query.match_type || 'best_fields',
      matchTypes = ['best_fields', 'most_fields', 'cross_fields', 'phrase', 'phrase_prefix'],
      // Human readable:
      hr = req.query.hr || 0,
      items_returned;

  // Check match_type for the right values.
  if (matchTypes.indexOf(match_type) === -1) {
    match_type = 'best_fields';
  }

  async.series( [
    // Get the first table contents
    function queryExecute( callback ) {

      var db = initCrate(),
        selectStr = "SELECT lochash, MAX(CONCAT(_score,'-',name)) AS name, ARBITRARY(locname) AS locname, ARBITRARY(lat) as lat, ARBITRARY(lng) as lng, " +
          "MAX(_score * (6000 - DISTANCE(lat_lng, [$1, $2]))) AS scored_dist, ARBITRARY(DISTANCE(lat_lng, [$1, $2])) AS distance " +
          "FROM items_v4_test2 " +
          "WHERE MATCH((name_ft $3, locname_ft $4, cattext_ft $5) , $6) USING " +match_type+ " AND DISTANCE(lat_lng, [$1, $2]) < 4828 " +
          "GROUP BY lochash ORDER BY scored_dist DESC limit 20",
        query = db.Query(selectStr);

      query.execute([lng, lat, name_ft, locname_ft, cattext_ft, q], function(err, res) {

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

    // Check hr and make human readable if set.
    if (hr == 1) {
      var json = {"items":responseItems};
      var str  = "<pre>" +JSON.stringify(json, '', 4)+ "</pre>";
      res.send(str);
    } else {
      res.json({
        'items' : responseItems
      });
    }

  });

};
