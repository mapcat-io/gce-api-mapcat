var Crate = require('../../crate.js'),
    stub = require('./v2_stubs.js');

// TODO: Improve performance of this query
var db = initCrate();

exports = module.exports = function(req, res) {

  var data = req.query;

  if (data.t === 'profile' && data.u) {
    var query = db.Query('SELECT item_id from items_to_devices where device_id = ?'),
        params = [data.u.toUpperCase()];

    query.execute(params, function(err, response) {
      if (err) {
        var message = 'Error retrieving user item stats from items_to_devices: ' + JSON.stringify(err);
        console.log(message);
        res.json({
          response: message
        });
      } else {
        console.log('Retrieved user item relations');
	
	var count = response.rows.length, inString = [];
	for (i = 0; i < count; i++) {
          inString.push(response.rows[i][0]);
        };

	 var query2 = db.Query('SELECT j, loc_name from items_big where id in ('+"'"+inString.join("','")+"'"+')');

//console.log('SELECT j, loc_name from items_big where id in ('+"'"+inString.join("','")+"'"+')');

        params2 = ["'"+inString.join("','")+"'"];

    query2.execute(params2, function(err, response) {
      if (err) {
        var message = 'Error retrieving user item stats from items_big: ' + JSON.stringify(err);
        console.log(message);
        res.json({
          response: message
        });
      } else {
        console.log('Retrieved user item stats');



		
       
        var responseItems = [],
            count = response.rows.length;
            
        for (i = 0; i < count; i++) {
	  if(responseItems.indexOf(response.rows[i][1])==-1)
	  {
          	responseItems.push(response.rows[i][1]);
	  }
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

	 }
    });


  } else {
    res.json(stub.itemStats());
  };

}
