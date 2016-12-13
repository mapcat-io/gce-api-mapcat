var uuidV4 = require('uuid/v4');

exports.uuid = function () {
  // underscore is used to avoid collision with uuids generated elsewhere.
  return '_' + uuidV4(); // -> '_110ec58a-a0f2-4ac4-8393-c866d813b8d1'
};
