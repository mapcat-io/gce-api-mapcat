var async = require('async'),
    Crate = require('../../crate.js'),
    md5 = require('md5');

var db = initCrate(),
    query = db.Query('select *, distance(location, [$1, $2]) as distance_in_meters from items_big where (itm_name like $3 or cat_name like $3 or loc_name like $3) and distance(location, [$1, $2]) <  4828 order by distance_in_meters limit 100');

exports = module.exports = function(req, res) {

  var q = '%' + req.query.q.trim().toLowerCase() + '%' || '', // search term
      u = req.query.u || '', // ios deviceId
      lat = req.query.lat || '',
      lng = req.query.long || '',
      items_returned;

  async.series( [
      // Get the first table contents
      function ( callback ) {

      query.execute([parseFloat(lng), parseFloat(lat), q],function(err,res){

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

    jsn = JSON.parse(items_returned[i][3]);

    if ( typeof jsn.location == 'undefined' || !jsn.location ) {
      jsn.location = {};
    };
    if ( typeof jsn.location.street == 'undefined' || !jsn.location.street ) {
      jsn.location.street = '';
    };
    if ( typeof jsn.location.name == 'undefined' || !jsn.location.name ) {
      jsn.location.name = '';
    };

    mds=md5(jsn.location.street.toLowerCase + ' ' + jsn.location.name.toLowerCase + ' ' + jsn.loc.coordinates[0] + ' ' + jsn.loc.coordinates[1]);

    if (!(mds in modifiedItems)) {
      modifiedItems[mds]={_id: {name: jsn.location.name, street: jsn.location.street}, coordinates: [jsn.loc.coordinates], things:[jsn.name],distance:[items_returned[i][6]],location:jsn.location};
    } else {
      modifiedItems[mds].things.push(jsn.name);
      modifiedItems[mds].coordinates.push(jsn.loc.coordinates);
      modifiedItems[mds].distance.push(items_returned[i][6]);
    };
  }

  responseItems=[];

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
