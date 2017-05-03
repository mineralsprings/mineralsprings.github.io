function parseAndWrite(json, key, elm_id, lead, foll) {
  console.log(json);
  document.getElementById(elm_id).innerHTML = lead + JSON.parse(json)[key] + foll;
}

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callback(xmlHttp.responseText);
    }
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}