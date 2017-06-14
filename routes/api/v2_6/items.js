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
      // cattext_ft = parseFloat(req.query.cattext_ft) || 5.0,
      match_type = req.query.match_type || 'best_fields',
      matchTypes = ['best_fields', 'most_fields', 'cross_fields', 'phrase', 'phrase_prefix'],
      // Human readable:
      hr = parseInt(req.query.hr) || 0,
      items_returned;

  // Check match_type for the right values.
  if (matchTypes.indexOf(match_type) === -1) {
    match_type = 'best_fields';
  }

  async.series( [
    // Get the first table contents
    function _queryExecute( callback ) {

      var db = initCrate(),
        selectStr = "SELECT lochash, MAX(CONCAT(_score,'-',name)) AS name, ARBITRARY(locname) AS locname, ARBITRARY(lat) as lat, ARBITRARY(lng) as lng, " +
          "MAX(_score * (6000 - DISTANCE(lat_lng, [$1, $2]))) AS scored_dist, ARBITRARY(DISTANCE(lat_lng, [$1, $2])) AS distance, " +
          "ARBITRARY(description) AS description, ARBITRARY(type_id) AS type_id " +
          "FROM items_v6 " +
          "WHERE MATCH((name_ft $3, locname_ft $4) , $5) USING " +match_type+ " AND DISTANCE(lat_lng, [$1, $2]) < 4828 " +
          "GROUP BY lochash ORDER BY scored_dist DESC limit 50",
        query = db.Query(selectStr);

      query.execute([lng, lat, name_ft, locname_ft, q], function(err, res) {

        if (err) {
          //console.log(err.statusCode);
        }

        if (res !== null) {
          items_returned = res.rows;
        } else {
          items_returned = [];
        }
        callback();
      });

    }

  // Send the response
  ], function _setResponse( error, results ) {

    var foundElements = {};

    for (var i = 0, len = items_returned.length; i < len; i++) {

      var lochashField = items_returned[i][0];
      var nameField = items_returned[i][1];
      var locnameField = items_returned[i][2];
      var latField = items_returned[i][3];
      var lngField = items_returned[i][4];
      // var scoredDistField = items_returned[i][5];  // unused.
      var distanceField = items_returned[i][6];
      var descriptionField = items_returned[i][7];

      // typeIdField = 0 - for items
      // typeIdField = 10 - for locations
      // typeIdField > 10 - for SLUG.
      var typeIdField = items_returned[i][8];

      var mds = lochashField;
      var things_name = nameField.substr(nameField.indexOf('-') + 1);

      if (!(mds in foundElements)) {
        foundElements[mds] = {
          _id: {
            name: locnameField
          },
          type_id: [typeIdField],
          coordinates: [lngField, latField],
          // Set name from nameField for items and from description for locations and SLUGs.
          things: typeIdField <= 10 ? [things_name] : [descriptionField],
          // Add description property if item.
          description: typeIdField > 0 ? [''] : [descriptionField],
          distance: [distanceField],
          location: {
            name: locnameField,
	          lochash: lochashField
          }
        };

      } else {
        // Add as things to existing location.
        foundElements[mds].type_id.push(typeIdField);
        foundElements[mds].coordinates.push([lngField, latField]);
        foundElements[mds].things.push(typeIdField <= 10 ? things_name : descriptionField);
        foundElements[mds].description.push(typeIdField > 0 ? '' : descriptionField);
        foundElements[mds].distance.push(distanceField);

      } // End else.

    } // End for.

    var responseItems=[];

    for (var key in foundElements) {
      if (foundElements.hasOwnProperty(key)) {
        responseItems.push(foundElements[key]);
      }
    }

    // Check hr and make human readable if set.
    if (hr === 1) {
      var json = {"items":responseItems};
      var str  = "<pre>" +JSON.stringify(json, '', 4)+ "</pre>";
      res.send(str);
    } else {
      res.json({'items' : responseItems});
    }

  });

};
