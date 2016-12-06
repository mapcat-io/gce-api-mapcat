var Crate = require('crate-connect');
var md5 = require('md5');
var db = new Crate({
  host: '127.0.0.1', //Defaults to localhost 
  port: 4200, //Defaults to 4200 
  // You can also send in a cluster of nodes 
  cluster: [
      {
        host: '127.0.0.1',
        port:4200
      },
  ]
});

var async = require('async');


const express = require('express')  
const app = express()  
const port = 3911


var queries = {
  getItems: db.Query('select *, distance(location, [$1, $2]) as distance_in_meters from items_big where (itm_name like $3 or cat_name like $3 or loc_name like $3) and distance(location, [$1, $2]) <  4828 order by distance_in_meters limit 100'),
  getSomeStuff:  db.Query('select * FROM items_big LIMIT 10'),
};



app.get('/',function(req,response){
    var items_returned;
	
	  var q = '%'+req.query.q+'%' || '', // search term
      u = req.query.u || '', // ios deviceId
      lat = req.query.lat || '',
	  lng = req.query.long || '';
	
	
	
    async.series( [
        // Get the first table contents
        function ( callback ) {
				
				

				
				queries.getItems.execute([parseFloat(lng),parseFloat(lat),q],function(err,res){
				
				  if(err) {
					//console.log(err.statusCode);
				}
				
				if(res!=null)
				{
				
					//console.log(res.rows);
					items_returned = res.rows;
				
				}
				else
				{
					items_returned = [];
					
				}
				callback();
			});
			
        }

   // Send the response
    ], function ( error, results ) {
        
		var modifiedItems = {};
		
		for(var i = 0, len = items_returned.length; i < len; i++)
		{
			
			
			
			jsn = JSON.parse(items_returned[i][3]);
			

if ( typeof jsn.location.street == 'undefined' || !jsn.location.street )
{
  jsn.location.street = '';
}


if ( typeof jsn.location.name == 'undefined' || !jsn.location.name )
{
  jsn.location.name = '';
}


			mds=md5(jsn.location.street.toLowerCase+' '+jsn.location.name.toLowerCase+' '+jsn.loc.coordinates[0]+' '+jsn.loc.coordinates[1]);
			
			//console.log(items_returned[i][3]);
			//console.log(mds);
			
			
			if (!(mds in modifiedItems))
			{
				modifiedItems[mds]={_id: {name: jsn.location.name, street: jsn.location.street}, coordinates: [jsn.loc.coordinates], things:[jsn.name],distance:[items_returned[i][6]],location:jsn.location};
			}
			else
			{
				modifiedItems[mds].things.push(jsn.name);
				modifiedItems[mds].coordinates.push(jsn.loc.coordinates);
				modifiedItems[mds].distance.push(items_returned[i][6]);
			}
		}
		
		responseItems=[];
		
		for (var key in modifiedItems) {
		   if (modifiedItems.hasOwnProperty(key)) {
				responseItems.push(modifiedItems[key]);
		   }
		}
		
		
		response.json({
            'items' : responseItems
        });
    } );

} );



app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
