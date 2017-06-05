var Crate = require('../../crate.js'),
    utils = require('../../utils');

var db = initCrate(),
    insertItemsBig = db.Insert('items_v5'),
    insertItemsToDevices = db.Insert('items_to_devices');

var crypto = require('crypto');

function normalizeLocation(name, lat, lng, itemNormalize) {
  if (itemNormalize === undefined) itemNormalize = false;

  lat = +lat.toFixed(3);
  lng = +lng.toFixed(3);

  // lat=number_format(round(lat,3),3,".","");
  // lng=number_format(round(lng,3),3,".","");

  name=" " +name+ " ";

  name = name.replace(" Co-op ", "");

  // name=str_ireplace(array(" Co-op "),"",name);

  name = name.replace(";", " ");
  name = name.replace(".", " ");
  name = name.replace(",", " ");
  name = name.replace("^", " ");
  name = name.replace("~", " ");
  name = name.replace("!", " ");
  name = name.replace("@", " ");
  name = name.replace("#", " ");
  name = name.replace("$", " ");
  name = name.replace("%", " ");
  name = name.replace("&", " ");
  name = name.replace("*", " ");
  name = name.replace("(", " ");
  name = name.replace(")", " ");
  name = name.replace("-", " ");
  name = name.replace("–", " ");
  name = name.replace("—", " ");
  name = name.replace("=", " ");
  name = name.replace("_", " ");
  name = name.replace("+", " ");
  name = name.replace("]", " ");
  name = name.replace("[", " ");
  name = name.replace("{", " ");
  name = name.replace("}", " ");
  name = name.replace('"', " ");
  name = name.replace("'", " ");
  name = name.replace("/", " ");
  name = name.replace("\\", " ");
  name = name.replace(">", " ");
  name = name.replace("<", " ");

  // name=str_ireplace(array(";",".",",","^","~","!","@","#","$","%","&","*","(",")","-","–","—","=","_","+","]","[","{","}",'"',"'","/","\\",">","<")," ",name);
  name = " " +name.toLowerCase() + " ";
  // name=" ".strtolower(name)." ";

  name = name.replace(" co ", "");
  name = name.replace(" and ", "");
  name = name.replace(" inc ", "");
  name = name.replace(" ltd ", "");
  name = name.replace(" l t d ", "");
  name = name.replace(" usa ", "");
  name = name.replace(" us ", "");
  name = name.replace(" coop ", "");
  //name=str_ireplace(array(" co "," and "," inc ", " ltd ", " l t d ", " USA ", " US ", "coop"),"",name);
  name = name.replace(" ", "");
  // name=str_replace(" ","",name);

  // @TODO What here??
  // name=trim(name);

  if(!itemNormalize) {
    return name + "_" + lat + "_" + lng;
  }
  else
    return name;
}

exports = module.exports = function(req, res) {
  if (req.method === 'POST') {
    var data = (req.method === 'POST') ? req.body : req.query,
        itemsToSaveItemsBig = [],
        itemsToSaveItemsToDevices = [];

    for (var key in data.items) {
      var uuid = utils.uuid();

      var locstring = normalizeLocation(data.foursquare.name, data.foursquare.location.lat, data.foursquare.location.lng, false);
      var lochash = crypto.createHash('md5').update(locstring).digest("hex").toLowerCase();
      var item_hash_string = normalizeLocation(data.items[key],0,0,true) + "_" + locstring;
      var item_hash = crypto.createHash('md5').update(item_hash_string).digest("hex").toLowerCase();

      var objItemsBig = {
        "name": data.items[key],
        "locname": data.foursquare.name,
        "lat_lng": [data.foursquare.location.lng, data.foursquare.location.lat],
	      "lat": data.foursquare.location.lat,
	      "lng": data.foursquare.location.lng,
	      "timestamp": Date.now(),
	      "categories": [-1],
	      "description": '',
	      "image_url": '',
	      "addon_info": {},
	      "item_hash": item_hash,
        "lochash": lochash,
        "type_id": 0
      };

      var objItemsToDevices = {
          "item_id": uuid,
          "device_id": data.source.deviceId || '',
          "timestamp": Date.now()
        };

      /*var j = {
        "_id": {
          "$oid": uuid
        },
        "name": data.items[key],
        "loc": {
          "type": "Point",
          "coordinates": [data.foursquare.location.lng,data.foursquare.location.lat]
        },
        "location": {
          "name": data.foursquare.name,
          "foursquareId": data.foursquare.id,
          "street": data.foursquare.location.address,
          "postalCode": data.foursquare.location.postalCode,
          "city": data.foursquare.location.city,
          "state": data.foursquare.location.state,
          "country": data.foursquare.location.country,
          "phone": data.foursquare.contact.phone,
          "twitterId": data.foursquare.contact.twitter,
          "facebookId": data.foursquare.contact.facebook,
          "categoryName": data.foursquare.categories[0].name,
          "siteUrl": data.foursquare.url
        },
        "source": {
          "name": data.source.name,
          "deviceId": data.source.deviceId || ''
        }
      };*/

//      objItemsBig["addon_info"] = JSON.stringify(j);
	
      itemsToSaveItemsBig.push(objItemsBig);

      if (typeof data.source.deviceId !== 'undefined' && data.source.deviceId !== null) {
        itemsToSaveItemsToDevices.push(objItemsToDevices);
      }

    } // End for.

    // save items to items_to_devices table
    insertItemsToDevices.data(itemsToSaveItemsToDevices).run(function(err, response) {
      if (err) {
        var message = 'Error saving items to items_to_devices: ' + JSON.stringify(err);
        console.log(message);
      } else {
        console.log('Saved items to items_to_devices.');
      }
    });

    // save items to items_big table
    insertItemsBig.data(itemsToSaveItemsBig).run(function(err, response) {
      if (err) {
        var message = 'Error saving items to items_big: ' + JSON.stringify(err);
        console.log(message);
        res.json({
          response: message
        });
      } else {
        console.log('Saved items to items_big.');
        res.json({
          response: 'Saved items to items_big: ' + JSON.stringify(response)
        });
      }
    });

  } else {
    res.json({response: 'Post new items endpoint.'});
  }
};
