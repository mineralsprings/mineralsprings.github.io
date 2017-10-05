/* do somethings "asynchronously" */
function async(your_function, callback) {
    setTimeout(function() {
        your_function();
        if (callback) { callback(); }
    }, 0);
}

/* listen for a click on an element */
function listenClick(id, fn) {
  document.getElementById(id).addEventListener("click", fn);
}

/* */
function doOptionsCheckBox (e) {
  if (e.target.nodeName === "INPUT") { // prevent event bubbling / chrome's duplication
    editMenuForm.doSpecialCheckBox(e.target.parentElement);
  }
}

/* hide these named elements */
function hideElements(className) {
  var blocks = document.getElementsByClassName(className);
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].style.display = "none";
  }

}

/* replaces the spread operator ... */
function spread () {
  var out = [].concat.apply([], arguments[0]);

  for (var i = 1; i < arguments.length; i++) {
    out = [].concat.apply(out, arguments[i]);
  }

  return out;
}

/* developer env vs production server */
function getServerHostForEnv() {
  return null !== window.location.href.match(/^http:\/\/localhost:(3000|8080).*$/)
    ? "http://localhost:8080"
    : "https://catnipcdn.pagekite.me" ;
}

/* now in microseconds */
function microTime() {
  return 1000 * new Date();
}

/* determine how to make XHR requests in this browser */
function getXHRCallable() {
  var xmlHttp;
  // Mozilla / Chromium / WebKit / KHMTL (like Gecko)
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();

  // IE
  } else if (window.ActiveXObject) {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");

  // ????
  } else {
    console.log("no way to XMLHttpRequest, giving up");
    // you're drunk
    alert("don't know how internet works HTTP anymore?????");
    throw new Error("don't know how internet works HTTP anymore?????");
  }

  return xmlHttp;
}

/* get something asynchronously */
function httpGetAsync(url, callback, failfun) {

  var xmlHttp = getXHRCallable();
  xmlHttp.open("GET", url, true); // true for asynchronous

  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200) {
        callback(xmlHttp.responseText);
      } else {
        failfun(xmlHttp, url);
      }
    }
  }
  xmlHttp.send(null); // connection close
}

/* post some data async */
function httpPostAsync(url, callback, failfun, data) {
  var xmlHttp = getXHRCallable();

  xmlHttp.open('POST', url, true);
  xmlHttp.setRequestHeader('Content-Type', 'application/json');

  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200) {
        callback(xmlHttp.responseText);
      } else {
        failfun(xmlHttp, url);
      }
    }
  }
  xmlHttp.send(data);
}

function httpGetSync(url, data) {
  var xmlHttp = getXHRCallable();

  xmlHttp.open("GET", url, false);
  xmlHttp.setRequestHeader('Content-Type', 'application/json');
  xmlHttp.send(data || null);
  // need an error condition here
  return xmlHttp.responseText;
}

function httpPostSync(url, data) {
  var xmlHttp = getXHRCallable();

  xmlHttp.open("POST", url, false);
  xmlHttp.setRequestHeader('Content-Type', 'application/json');
  xmlHttp.send(data || null);
  // need an error condition here
  return xmlHttp.responseText;
}