var Crate = require('../../crate.js'),
    // utils = require('../../utils'),
    geo_utils = require('../../geo_utils');

var db = initCrate();
var insertItemsV6 = db.Insert('items_v6');
var insertItemsToDevices = db.Insert('items_to_devices');

var crypto = require('crypto');

exports = module.exports = function(req, res) {
  if (req.method === 'POST') {
    var data = (req.method === 'POST') ? req.body : req.query,
        itemsToSaveItemsV6 = [],
        itemsToSaveItemsToDevices = [];

    for (var key in data.items) {
      // var uuid = utils.uuid();

      var locstring = geo_utils.normalizeLocation(data.foursquare.name, data.foursquare.location.lat, data.foursquare.location.lng, false);
      var lochash = crypto.createHash('md5').update(locstring).digest("hex").toLowerCase();
      var item_hash_string = geo_utils.normalizeLocation(data.items[key],0,0,true) + "_" + locstring;
      var item_hash = crypto.createHash('md5').update(item_hash_string).digest("hex").toLowerCase();

      var timestamp = Date.now();

      var objItemsV6 = {
        "name": data.items[key],
        "locname": data.foursquare.name,
        "lat_lng": [data.foursquare.location.lng, data.foursquare.location.lat],
	      "lat": data.foursquare.location.lat,
	      "lng": data.foursquare.location.lng,
	      "timestamp": timestamp,
	      "categories": [-1],
	      "description": '',
	      "image_url": '',
	      "addon_info": {},
	      "item_hash": item_hash,
        "lochash": lochash,
        "type_id": 0
      };

      var objItemsToDevices = {
          "item_id": item_hash,
          "device_id": data.source.deviceId || '',
          "timestamp": timestamp
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

//      objItemsV5["addon_info"] = JSON.stringify(j);
	
      itemsToSaveItemsV6.push(objItemsV6);

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

    // save items to items_v6 table
    insertItemsV6.data(itemsToSaveItemsV6).run(function(err, response) {
      if (err) {
        var message = 'Error saving items to items_v6: ' + JSON.stringify(err);
        console.log(message);
        res.json({
          response: message
        });
      } else {
        console.log('Saved items to items_v6.');
        res.json({
          response: 'Saved items to items_v6: ' + JSON.stringify(response)
        });
      }
    });

  } else {
    res.json({response: 'Post new items endpoint.'});
  }
};
