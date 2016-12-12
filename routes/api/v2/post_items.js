var Crate = require('../../crate.js');

var db = initCrate(),
    insert = db.Insert('items_big');

var uniqueId = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 34);
};

exports = module.exports = function(req, res) {
  if (req.method == 'POST') {
    var data = (req.method == 'POST') ? req.body : req.query,
        itemsToSave = [];

    for (var key in data.items) {
      var obj = {
        id: uniqueId(),
        itm_name: data.items[key],
        loc_name: data.foursquare.name,
        location: [data.foursquare.location.lng, data.foursquare.location.lat]
      };
      itemsToSave.push(obj);
    };
    console.log(itemsToSave);
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
}

// { foursquare:
//    { verified: true,
//      venueChains: [],
//      url: 'http://visitunionsquaresf.com',
//      stats: { tipCount: 406, checkinsCount: 141432, usersCount: 75176 },
//      categories: [ [Object] ],
//      storeId: '',
//      contact:
//       { formattedPhone: '(415) 781-7880',
//         twitter: 'unionsquaresf',
//         facebookName: 'Union Square, San Francisco',
//         phone: '4157817880',
//         facebookUsername: 'UnionSquareSF',
//         facebook: '213604681983905' },
//      location:
//       { postalCode: '94108',
//         distance: 72,
//         address: '333 Post St',
//         crossStreet: 'btwn Post, Stockton, Geary & Powell St.',
//         city: 'San Francisco',
//         formattedAddress: [Object],
//         state: 'CA',
//         lat: 37.78782954496378,
//         lng: -122.4076614126047,
//         cc: 'US',
//         country: 'United States' },
//      specials: { count: 0, items: [] },
//      referralId: 'v-1481502731',
//      name: 'Union Square',
//      hasPerk: false,
//      id: '40bbc700f964a520b1001fe3',
//      beenHere: { lastCheckinExpiredAt: 0 },
//      hereNow: { count: 9, summary: '9 people are here', groups: [Object] },
//      venuePage: { id: '34303229' } },
//   items:
//    { AddItem1: 'One',
//      'Test Category': 'Test Category',
//      AddItem2: 'Two' },
//   source:
//    { name: 'webView',
//      deviceId: '8696A22C-716A-4212-8EB5-929A66B121ED' } }
