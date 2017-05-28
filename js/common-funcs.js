function async(your_function, callback) {
    setTimeout(function() {
        your_function();
        if (callback) { callback(); }
    }, 0);
}

/*
function parseAndWrite(json, key, elm_id, lead, foll) {
  console.log(json);
  document.getElementById(elm_id).innerHTML = lead + JSON.parse(json)[key] + foll;
}
*/

function hideElements(className) {
  var blocks = document.getElementsByClassName(className);
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].style.display = "none";
  }

}


/* developer env vs production server */
function getServerHostForEnv() {
  return null !== window.location.href.match(/^http:\/\/localhost:(3000|8080).*$/)
    ? "http://localhost:8080"
    : "https://catnipcdn.pagekite.me" ;
}


function microTime() {
  return 1000 * new Date();
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
    // you're drunk
    throw new Error("don't know how internet works HTTP anymore?????");
    alert("don't know how internet works HTTP anymore?????");
  }

  return xmlHttp;
}


function httpGetAsync(theUrl, callback, failfun) {

  var xmlHttp = getXHRCallable();
  xmlHttp.open("GET", theUrl, true); // true for asynchronous

  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200) {
        callback(xmlHttp.responseText);
      } else {
        failfun(xmlHttp, theUrl);
      }
    }
  }
  xmlHttp.send(null); // connection close
}


function httpPostAsync(theUrl, callback, failfun, data) {
  var xmlHttp = getXHRCallable();

  xmlHttp.open('POST', theUrl, true);
  xmlHttp.setRequestHeader('Content-Type', 'application/json');

  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4) {``
      if (xmlHttp.status === 200) {
        callback(xmlHttp.responseText);
      } else {
        failfun(xmlHttp, theUrl);
      }
    }
  }
  xmlHttp.send(data);
}
