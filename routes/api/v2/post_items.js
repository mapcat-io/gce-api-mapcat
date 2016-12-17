var Crate = require('../../crate.js'),
    utils = require('../../utils');

var db = initCrate(),
    insertItemsBig = db.Insert('items_big'),
    insertItemsToDevices = db.Insert('items_to_devices');

exports = module.exports = function(req, res) {
  if (req.method == 'POST') {
    var data = (req.method == 'POST') ? req.body : req.query,
        itemsToSaveItemsBig = [],
        itemsToSaveItemsToDevices = [];

    for (var key in data.items) {
      var uuid = utils.uuid();
      var objItemsBig = {
          "id": uuid,
          "itm_name": data.items[key],
          "loc_name": data.foursquare.name,
          "location": [data.foursquare.location.lng, data.foursquare.location.lat]
        };
      var objItemsToDevices = {
          "item_id": uuid,
          "device_id": data.source.deviceId || '',
          "timestamp": Date.now()
        };
      var j = {
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
      };

      objItemsBig["j"] = JSON.stringify(j);
      itemsToSaveItemsBig.push(objItemsBig);

      if (typeof data.source.deviceId !== 'undefined' && data.source.deviceId !== null) {
        itemsToSaveItemsToDevices.push(objItemsToDevices);
      }
    };

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
