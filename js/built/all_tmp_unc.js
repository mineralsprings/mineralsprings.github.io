function async(your_function, callback) {
    setTimeout(function() {
        your_function();
        if (callback) { callback(); }
    }, 0);
}

function listenClick(id, fn) {
  document.getElementById(id).addEventListener("click", fn);
}

function doOptionsCheckBox (e) {
  if (e.target.nodeName === "INPUT") { // prevent event bubbling / chrome's duplication
    editMenuForm.doSpecialCheckBox(e.target.parentElement);
  }
}

function hideElements(className) {
  var blocks = document.getElementsByClassName(className);
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].style.display = "none";
  }

}

function spread () {
  var out = [];
      out = [].concat.apply([], arguments[0]);

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
    alert("don't know how internet works HTTP anymore?????");
    throw new Error("don't know how internet works HTTP anymore?????");
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
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200) {
        callback(xmlHttp.responseText);
      } else {
        failfun(xmlHttp, theUrl);
      }
    }
  }
  xmlHttp.send(data);
}
function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  console.log("clicked sign in");

  currentGoogleUser = {};
  currentGoogleUser.vendor = googleUser;
  currentGoogleUser.reload = googleUser.reloadAuthResponse;

  var id_token = googleUser.getAuthResponse().id_token;

  httpPostAsync(
    getServerHostForEnv(),
    function (response) {
      var info = JSON.parse(response);
      console.log(info);

      anticsrf = info.data.anticsrf;

      // NOTE: VALIDATE THIS!!!!
      currentGoogleUser.nih_info = info.data.gapi_info;

      afterGLoginWriter();
    },
    function (url, req) {
      console.log("failed " + req);
    },
    JSON.stringify(defaultJSONObjs.initial_gapi_validate(id_token))
  );
}

function renderButton() {
  gapi.signin2.render('glogin', {
    'scope': 'profile email',
    'width': 400,
    'height': 100,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSignIn,
    'onfailure': function (error) { console.log(error); }
  });
}

function doSignOut () {
  if (! confirm("Are you sure you would like to sign out of Mineral Springs?")) {
    return;
  }
  var btnwrp = document.getElementById("buttonWrapper");
  removeChildren(btnwrp);
  signOut();
  /*firstLoader(); trigger a refresh instead */
  window.location.reload();
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();

  auth2.signOut().then(function () {
    console.log('User signed out.');
    //document.getElementById("google-signin").style.display = "none";
  });
}

googleAPIFile = {
  ok:
    function (response) {
      var elt = document.getElementById("google-auth-check");
      //console.log(response);
      if (response === "google-site-verification: googlebb7e3fa23640d3b2.html") {
        elt.style.color = "green";
        elt.innerHTML += " OK";
      } else {
        console.log("auth no good");
        elt.style.color = "red";
        elt.innerHTML += " missing";
      }
    },
  err:
    function(url, resp) {
      var elt = document.getElementById("google-auth-check");
      console.log("failed to GET " + url + " returned " + resp.status.toString());
      console.log("auth no good");
      elt.style.color = "red";
      elt.innerHTML += " missing";
    }
};

catnipCDNUp = {
  ok:
    function (response) {
      var rsp = JSON.parse(response),
          elt = document.getElementById("cdn-api-check");
      rsp["time"]["conn_finish"] = microTime();
      /*console.log(rsp);*/

      if (
          (rsp["response"]         === "reply_ping") &&
          (rsp["data"]["pingback"] === true)
      ) {
        enableBigButton();
        console.log("catnip ok");
        writeConnTimeStats(rsp["time"]);
        elt.style.color = "green";
        elt.innerHTML += " OK";
      } else {
        catnipCDNUp.cdn_no_good()
      }
    },
  err:
    function (url, resp) {
      /*console.log("failed to POST to " + url + " returned " + resp.status.toString());*/
      catnipCDNUp.cdn_no_good()
    },

  cdn_no_good:
    function () {
      console.log("catnip no good");

      var elt = document.getElementById("cdn-api-check");
      elt.style.color = "red";
      elt.innerHTML += " missing";
      document.getElementById("bigcircle").addEventListener("mousedown", function() {
        alert("Sorry, your request cannot be processed, because the server (" + getServerHostForEnv() + ") is down for maintenance. Try again later.");
      });
    }
};

defaultJSONObjs = {
  ping: {
    "verb": "ping",
    "data": {
      "ping": "hello",
    },
    "time": {
      "conn_init": microTime(),
    }
  },

  initial_gapi_validate: function(tok) {
    return {
      'verb': 'gapi_validate',
      'data': {
        'gapi_key': tok
      },
      "time": {
        "conn_init": microTime(),
      }
    }
  },
  view_menu: function () {
    return {
      "verb": "view_menu",
      "data": {},
      "time": {
        "conn_init": microTime()
      },
      "anticsrf": (anticsrf.tok || "")
    }
  }
};function removeChildren(elt) {
  while (elt.firstChild) {
    elt.removeChild(elt.firstChild);
  }
}

function loadContent(page) {
  viewIsHome = false;

  hideElements("block");

  var pname = "views/" + page + ".html";
  httpGetAsync(
    pname,
    function (response) {
      // need to animate this somehow
      var inject = response;
      btnwrp = document.getElementById("buttonWrapper");

      removeChildren(btnwrp);

      btnwrp.insertAdjacentHTML("beforeend", inject);

      if ("forms/menu" === page) {
        document.getElementById("default-special-checkbox").addEventListener("click", function (e) {
          if ("INPUT" === e.target.nodeName) {
            editMenuForm.doSpecialCheckBox(e.target.parentElement);
          }
        })
      }
    },

    function (url, req) {
      console.log("failed to inject " + pname);
      // well this ocurrence is a developer screw up so idk what else to put here
    }
  );
}

function afterGLoginWriter() {
  async(
    function() {
      var elems = [
        document.getElementById("googleSignInWrapper"),
        document.getElementById("bigcircle")
      ];

      for (var i = 0; i < elems.length; i++) {
        var e = elems[i];
        if (e) {
          e.parentNode.removeChild(e);
        }
      }
    },
    async(mainPageLoader,
      function () {
        var probutton = document.getElementById("profileButton");
        probutton.style.backgroundImage = "url(" + currentGoogleUser.nih_info.picture + ")";
        probutton.style.display = "inline-block";
      }
    )
  );
}

function mainPageLoader () {

  if (! viewIsHome) {

    viewIsHome = true;

    var fnames = [ "big2" ];


    fnames.push(
      [ "user", "admin" ][ + ((currentGoogleUser || {}).nih_info || {}).is_elevated || 0  ]
    );

    var btnWrp = document.getElementById("buttonWrapper");

    removeChildren(btnWrp);

    for (var i = 0; i < fnames.length; i++) {
      var fn = fnames[i];
      var abspath = "views/btns/" + fn + ".html";
      httpGetAsync(
        abspath,
        function (response) {
          document.getElementById("buttonWrapper").insertAdjacentHTML("beforeend", response);
        },

        function (url, req) {
          console.log("failed to inject elt " + abspath);
          // well this ocurrence is a developer screw up so idk what else to put here
        }

      );
    }
  }
}

function showGLogin() {
  var circle = document.getElementById("bigcircle");
  circle.parentNode.removeChild(circle);
  var glogin = document.getElementById("googleSignInWrapper");
  glogin.style.display = "inline-block";
}

function initialLoader() {
  httpGetAsync(
    "views/btns/bigcircle.html",
    function (response) {
      document.getElementById("buttonWrapper").insertAdjacentHTML("beforeend", response);
    },

    function (url, req) {
      console.log("failed to inject elt " + abspath);
      // well this ocurrence is a developer screw up so idk what else to put here
    }
  );
}

function enableBigButton() {
  var circle  = document.getElementById("bigcircle");
  circle.addEventListener("click", showGLogin);

  document.getElementById("c_bigtext").innerHTML = "Login to Google";
  document.getElementById("c_liltext").innerHTML = "login to use this app";
}var currentGoogleUser = null;
var viewIsHome = false;
var anticsrf = {};

function checkGoogleAuthVerificationExists() {
  httpGetAsync(
    "googlebb7e3fa23640d3b2.html",
    googleAPIFile.ok,
    googleAPIFile.err
  );
}

function writeConnTimeStats(time) {
  var diff = Math.abs(time["conn_init"] - time["conn_finish"]);
  console.log("connection to the CDN took " + (diff / Math.pow(10, 3)).toString() + "msec");
}

function checkCatnipCDNStatusOk() {
  httpPostAsync(
    getServerHostForEnv(),
    catnipCDNUp.ok,
    catnipCDNUp.err,
    JSON.stringify(defaultJSONObjs.ping)
  );
}

function haveJS () {
  console.log("have JS (duh)");
  var alert = document.getElementById("alert");
  alert.parentNode.removeChild(alert);
  /*document.getElementById("buttonWrapper").style.display = "inherit";*/
}

function firstLoader() {
  // faster
  haveJS();
  async(
    initialLoader,
    function () {
      async(checkGoogleAuthVerificationExists, checkCatnipCDNStatusOk);
    }
  );
}

function doLoadingIconToggle (state, name) {
  console.log("loading " + (state ? "on" : "off") + " caller: " + name);
  document.getElementById("loading").style.display = state ? "inline-block" : "none";
}

function callLoader(fun) {
  doLoadingIconToggle(true, fun.name);
  fun();
  doLoadingIconToggle(false, fun.name);
}

function testFormsOffline (elv) {
  currentGoogleUser = { nih_info: { is_elevated: elv } };
  afterGLoginWriter();
}is_buffet = false;

var editMenuForm = {
  formResizer: {

    counter: 1,

    _getLastFieldSet: function () {
      var fields    = document.getElementsByTagName("fieldset");
      return fields.item(fields.length - 1);
    },

    addItem: function () {
      var newname =  'field-' + editMenuForm.formResizer.counter;
      var newfield = '<fieldset class="menu-field" id="' + newname + '" name="' + newname + '">\n';

      newfield +=
          '<label class="menu-itemname"> Item name:' +
            '<input class="menu-itemname-input" type="text" name="' + newname + '-name" value=""/>' +
          '</label>' +

          '<label class="menu-itemdesc"> Description:' +
            '<textarea class="menu-itemdesc-input" type="text" name="' + newname + '-desc" value=""/>' +
          '</textarea></label>'
          +
          '<label class="menu-itemprice" style="display: ' + (is_buffet ? "none" : "inline") + ';">'
          + 'Price:' +
            '<input class="menu-itemprice-input" type="number" name="' + newname + '-price" value="" />' +
          '</label>' +

          '<label class="menu-itemoptions" id="' + newname + '-special-checkbox">' +
            'Options?' +
            '<input class="menu-itemoptions-input" type="checkbox" name="' + newname + '-options" value=""/>' +
          '</label>';

      newfield += '<button type="button" onclick="editMenuForm.formResizer.removeItem('
                  + editMenuForm.formResizer.counter + ');">Remove this item</button>\n';

      newfield += '</fieldset>';
      document.getElementById("menu-form").insertAdjacentHTML('beforeend', newfield);
      ++editMenuForm.formResizer.counter;

      document.getElementById(newname + "-special-checkbox").addEventListener("click", function (e) {
        if ("INPUT" === e.target.nodeName) {
          editMenuForm.doSpecialCheckBox(e.target.parentElement);
        }
      })
    },

    removeLast: function () {
      var lastfield = editMenuForm.formResizer._getLastFieldSet();
      if ( null === lastfield || lastfield.id.match(/default/) ) {
        editMenuForm.formResizer.counter = 1;
        return;
      }
      // don't modify the counter here though
      lastfield.parentNode.removeChild(lastfield);
    },

    removeItem: function (n) {
      --editMenuForm.formResizer.counter;
      if (0 === n) { return; }
      var elem = document.getElementById("field-" + n);
      elem.parentNode.removeChild(elem);
    }
  },

  formExtract: function (name) {
    var all_items = {};
    var top_forms = document.getElementsByTagName("fieldset");
    for (var j = 0; j < top_forms.length; j++) {
      var local_result = {};
      var fs = top_forms[j];
      var need_tags = spread(fs.getElementsByTagName("input"), fs.getElementsByTagName("textarea"));

      for (var i = 0; i < need_tags.length; i++) {
        var intag = need_tags[i],
              val = (intag.type === "checkbox" ? intag.checked : intag.value),
              nme = intag.name;
        local_result[nme]  = val;
      }
      all_items[fs.id] = local_result;
    }
    all_items.is_buffet = document.getElementById("is_buffet").checked;
    console.log(all_items)
  },

  doSpecialCheckBox: function (label) {
    var cbox     = label.getElementsByTagName("input")[0],
        checked  = cbox.checked,
        topfield = label.parentElement;

    var optform = '<fieldset class="options-field" name="'
                  + cbox.name + '-fieldset" id="' + cbox.name + '-fieldset">';

    for (var i = 0; i < 3; i++) {
      optform += "<label class='options-name'>Name:" +
                    "<input type='text' name='" + cbox.name + "-options" + i + "-name'/>" +
                  "</label>";

      if (! is_buffet) {
        optform += "<label class='options-price'>Price:" +
                      "<input type='number' name='" + cbox.name + "-options" + i + "-price'/>" +
                    "</label>";
      }
      optform += "<br>\n";
    }

    optform += "</fieldset>";

    if (checked) {
      topfield.insertAdjacentHTML("beforeend", optform);
    } else {
      var optfs_name = cbox.name + "-fieldset",
               optfs = document.getElementById(optfs_name);

      optfs.parentElement.removeChild(optfs);

    }
  },

  doBuffetBox: function () {
    var box   = document.getElementById("is_buffet"),
    checked   = box.checked;
    is_buffet = checked;

    var warn = document.getElementById("buffet_warn");
    if (checked) {
      warn.removeAttribute("hidden")
    } else {
      warn.setAttribute("hidden", true)
    }

    var inputs = document.getElementsByTagName("input");
    for (var j = 0; j < inputs.length; j++) {
      var ip = inputs[j];
      if (ip.name.match(/price$/)) {
        ip.parentNode.style.display = checked ? "none" : "inline";
      }
    }
  }
}