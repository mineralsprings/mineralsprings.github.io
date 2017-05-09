function async(your_function, callback) {
    setTimeout(function() {
        your_function();
        if (callback) {callback();}
    }, 0);
}

function parseAndWrite(json, key, elm_id, lead, foll) {
  console.log(json);
  document.getElementById(elm_id).innerHTML = lead + JSON.parse(json)[key] + foll;
}

function getXHRCallable() {
  var xmlHttp;
  // Mozilla / Chromium / WebKit / KHMTL
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();

  // IE
  } else if (window.ActiveXObject) {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");

  // ????
  } else {
    console.log("no way to XMLHttpRequest, giving up");
    throw new Exception();
  }

  return xmlHttp;
}

function httpGetAsync(theUrl, callback, failfun) {

  var xmlHttp = getXHRCallable();

  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200) {
        callback(xmlHttp.responseText);
      } else {
        failfun(theUrl, xmlHttp);
      }
    }
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null); // connection close
}

function httpPostAsync(theUrl, callback, failfun, data) {
    var xmlHttp;
    // Mozilla/Safari/Chrome
    if (window.XMLHttpRequest) {
        xmlHttpReq = new XMLHttpRequest();
    }
    // IE
    else if (window.ActiveXObject) {
        xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlHttpReq.open('POST', theUrl, true);
    xmlHttpReq.setRequestHeader('Content-Type', 'application/json');
    xmlHttpReq.onreadystatechange = function() {
      if (xmlHttpReq.readyState === 4) {
        if (xmlHttpReq.status === 200) {
          callback(xmlHttpReq.responseText);
        } else {
          failfun(theUrl, xmlHttpReq);
        }
      }
    }
    xmlHttpReq.send(data);
}
