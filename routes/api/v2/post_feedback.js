var Crate = require('../../crate.js');

var db = initCrate(),
    feedbackTable = db.Insert('feedback');

exports = module.exports = function(req, res) {
  if (req.method == 'POST') {
    var data = (req.method == 'POST') ? req.body : req.query;
    var deviceId = data.deviceId || '';
    var obj = {
      "deviceId": deviceId,
      "feeling": data.feeling,
      "note": data.note
    };
    feedbackTable.data(obj).run(function(err, response) {
      if (err) {
        console.log('Error saving feedback: ' + JSON.stringify(err));
        res.json({
          response: 'Error saving feedback: ' + JSON.stringify(err)
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
