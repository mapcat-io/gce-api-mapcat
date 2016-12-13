var Crate = require('../../crate.js'),
    utils = require('../../utils');

var db = initCrate(),
    insert = db.Insert('items_big');

exports = module.exports = function(req, res) {
  if (req.method == 'POST') {
    var data = (req.method == 'POST') ? req.body : req.query,
        itemsToSave = [];

    for (var key in data.items) {
      var uuid = utils.uuid();
      var obj = {
          "id": uuid,
          "itm_name": data.items[key],
          "loc_name": data.foursquare.name,
          "location": [data.foursquare.location.lng, data.foursquare.location.lat]
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
      obj["j"] = JSON.stringify(j);
      itemsToSave.push(obj);
    };

    insert.data(itemsToSave).run(function(err, response) {
      if (err) {
        var message = 'Error saving items: ' + JSON.stringify(err);
        console.log(message);
        res.json({
          response: message
        });
      } else {
        console.log('Saved items.');
        res.json({
          response: 'Saved items: ' + JSON.stringify(response)
        });
      }
    });

  } else {
    res.json({response: 'Post new items endpoint.'});
  }
};
