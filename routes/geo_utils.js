/**
 * Created by sbor767@gmail.com on 06/07/2017.
 */

/**
 * See https://stackoverflow.com/a/7313467.
 * @param strReplace
 * @param strWith
 * @returns {string}
 */
String.prototype.replaceAll = function(strReplace, strWith) {
  // See http://stackoverflow.com/a/3561711/556609
  var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  var reg = new RegExp(esc, 'ig');
  return this.replace(reg, strWith);
};

exports.normalizeLocation = function (name, lat, lng, itemNormalize) {
  if (itemNormalize === undefined) itemNormalize = false;

  lat = +lat.toFixed(3);
  lng = +lng.toFixed(3);

  name=" " +name+ " ";

  name = name.replaceAll(" Co-op ", " ");

  name = name.replaceAll(";", " ");
  name = name.replaceAll(".", " ");
  name = name.replaceAll(",", " ");
  name = name.replaceAll("^", " ");
  name = name.replaceAll("~", " ");
  name = name.replaceAll("!", " ");
  name = name.replaceAll("@", " ");
  name = name.replaceAll("#", " ");
  name = name.replaceAll("$", " ");
  name = name.replaceAll("%", " ");
  name = name.replaceAll("&", " ");
  name = name.replaceAll("*", " ");
  name = name.replaceAll("(", " ");
  name = name.replaceAll(")", " ");
  name = name.replaceAll("-", " ");
  name = name.replaceAll("–", " ");
  name = name.replaceAll("—", " ");
  name = name.replaceAll("=", " ");
  name = name.replaceAll("_", " ");
  name = name.replaceAll("+", " ");
  name = name.replaceAll("]", " ");
  name = name.replaceAll("[", " ");
  name = name.replaceAll("{", " ");
  name = name.replaceAll("}", " ");
  name = name.replaceAll('"', " ");
  name = name.replaceAll("'", " ");
  name = name.replaceAll("/", " ");
  name = name.replaceAll("\\", " ");
  name = name.replaceAll(">", " ");
  name = name.replaceAll("<", " ");

  // name=str_ireplace(array(";",".",",","^","~","!","@","#","$","%","&","*","(",")","-","–","—","=","_","+","]","[","{","}",'"',"'","/","\\",">","<")," ",name);
  name = " " +name.toLowerCase() + " ";
  // name=" ".strtolower(name)." ";

  name = name.replaceAll(" co ", "");
  name = name.replaceAll(" and ", "");
  name = name.replaceAll(" inc ", "");
  name = name.replaceAll(" ltd ", "");
  name = name.replaceAll(" l t d ", "");
  name = name.replaceAll(" USA ", "");
  name = name.replaceAll(" US ", "");
  name = name.replaceAll(" coop ", "");
  //name=str_ireplace(array(" co "," and "," inc ", " ltd ", " l t d ", " USA ", " US ", "coop"),"",name);
  name = name.replaceAll(" ", "");
  // name=str_replace(" ","",name);

  name = name.trim();

  if(!itemNormalize) {
    return name + "_" + lat + "_" + lng;
  }
  else
    return name;
}
