/**
 * Created by sbor767@gmail.com on 06/07/2017.
 */

'use strict'

var unorm = require('unorm');
var xregexp = require("xregexp");

exports.normalizeLocation = function (name, lat, lng, itemNormalize) {
  if (itemNormalize === undefined) itemNormalize = false;

  lat = +lat.toFixed(3);
  lng = +lng.toFixed(3);

  /**
   * Replace utf-8 &nbsp analogue \xc2\xa0 with spaces.
   */
  // @TODO Can use such variant by xregexp.
  //var combining = xregexp("\xc2\xa0", "gu");
  //name = name.replace(combining, ' ');
  name = name.replace(/\xc2\xa0/g, ' ');
  // @TODO Uncomment this if required &nbsp;
  // name = name.replace(/(\xc2\xa0|&nbsp;)/g, ' '); // Working variant witn &nbsp;

  name = " " +name+ " ";

  name = name.replace(/ Co-op /ig, '');

  // NFKD normalize.
  // @TODO to avoid xregexp dependence uncomment and try next.
  //name = this.simpleTextNormailize(name);
  name = this.xregexpTextNormalize(name);

  // @TODO Check for necessity 'g' parameter. Try avoid xregexp - to do this required understanding which characters
  // must be removed.
  // @TODO Next causes an error.
  // var combining = xregexp("(?>[\x00-\x1F]|[\x7B-\xBF]|\xC2[\x80-\xBF]|\xE2[\x80-\x8F]{2}|\xE2\x80[\xA4-\xA8]|\xE2\x81[\x9F-\xAF])", "gu");
  // So try next. This also without xregexp dependence.
  // name = name.replace(/(?![\x00-\x1F]|[\x7B-\xBF]|\xC2[\x80-\xBF]|\xE2[\x80-\x8F]{2}|\xE2\x80[\xA4-\xA8]|\xE2\x81[\x9F-\xAF])./g, ''); // This also not work.
  // See https://stackoverflow.com/a/28651430. @TODO Check with!
  name = name.replace(/(?![\x00-\x7F]|[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3})./g, '');

  name = name.replace(/;|\.|,|\^|~|!|@|#|\$|%|&|\*|\(|\)|-|–|—|=|_|\+|]|\[|{|}|'|\||\/|\\|>|<|`|:|\?|’/g, ' ');

  name = " " +name.toLowerCase() + " ";

  name = name.replace(/ co | and | inc | ltd | l t d | USA | US |coop/igu, '')

  name = name.replace(/ /g, '')

  name = name.trim();

  if(!itemNormalize) {
    return name + "_" + lat + "_" + lng;
  }
  else
    return name;
}

// @TODO Remove exports bellow after tests.
exports.simpleTextNormailize = function (text) {
  return unorm.nfkd(text).replace(/[\u0300-\u036F]/g, '');
}

exports.xregexpTextNormalize = function (text) {
  var combining = xregexp("\\p{Mn}", "gu");
  return unorm.nfkd(text).replace(combining, '');
}
