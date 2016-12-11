var Crate = require('../../crate.js');

var db = initCrate(),
    insert = db.Insert('feedback');

exports = module.exports = function(req, res) {
  if (req.method == 'POST') {
    var data = (req.method == 'POST') ? req.body : req.query;
    var deviceId = data.deviceId || '';
    var obj = {
      "deviceId": deviceId,
      "feeling": data.feeling,
      "note": data.note
    };
    insert.data(obj).run(function(err, response) {
      if (err) {
        var message = 'Error saving feedback: ' + JSON.stringify(err);
        console.log(message);
        res.json({
          response: message
        });
      } else {
        console.log('Saved feedback.');
        res.json({
          response: 'Saved feedback: ' + JSON.stringify(response)
        });
      }
    });
  } else {
    res.json({response: 'Post feedback endpoint.'});
  }
}
