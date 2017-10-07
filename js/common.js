/* do somethings "asynchronously" */
function async(your_function, callback) {
    setTimeout(function() {
        your_function();
        if (callback) { callback(); }
    }, 0);
}

/* listen for a click on an element */
function listen_click(id, fn) {
  document.getElementById(id).addEventListener("click", fn);
}

/* */
function do_options_checkbox (e) {
  if (e.target.nodeName === "INPUT") { // prevent event bubbling / chrome's duplication
    menu_form.special_checkbox(e.target.parentElement);
  }
}

/* hide these named elements */
function hide_elements(class_name) {
  var blocks = document.getElementsByClassName(class_name);
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
function get_env_host() {
  return null !== window.location.href.match(/^http:\/\/localhost:(3000|8080).*$/)
    ? "http://localhost:8080"
    : "https://catnipcdn.pagekite.me" ;
}

var micro = {
  /* now in microseconds */
  time: function () {
    return 1000 * new Date();
  },

  to_seconds: function (m) {
    return m / 1000;
  },

  to_date_obj: function (m) {
    return new Date(micro.to_seconds(m));
  },

  to_date_str: function (m) {
    return micro.to_date_obj(m).toString();
  }
}


/* determine how to make XHR requests in this browser */
function xhr_callable() {
  var xhr;
  // Mozilla / Chromium / WebKit / KHMTL (like Gecko)
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();

  // IE
  } else if (window.ActiveXObject) {
    xhr = new ActiveXObject("Microsoft.xmlHttp");

  // ????
  } else {
    console.log("no way to xhrRequest, giving up");
    // you're drunk
    alert("don't know how internet works HTTP anymore?????");
    throw new Error("don't know how internet works HTTP anymore?????");
  }

  return xhr;
}

var http = {
  sync: {
    get: function (url, data) {
      var xhr = xhr_callable();

      xhr.open("GET", url, false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(data || null);
      // need an error condition here
      return xhr.responseText;

    },
    post: function (url, data) {
      var xhr = xhr_callable();

      xhr.open("POST", url, false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(data || null);
      // need an error condition here
      return xhr.responseText;
    }
  },

  nosync: {
    get: function (url, callback, failfun) {
      var xhr = xhr_callable();
      xhr.open("GET", url, true); // true for asynchronous

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            callback(xhr.responseText);
          } else {
            failfun(xhr, url);
          }
        }
      }
      xhr.send(null); // connection close

    },

    post: function (url, callback, failfun, data) {
      var xhr = xhr_callable();

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            callback(xhr.responseText);
          } else {
            failfun(xhr, url);
          }
        }
      }
      xhr.send(data);

    }
  }
}
