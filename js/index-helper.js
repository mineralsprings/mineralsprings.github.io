function checkGoogleAuthVerificationExists() {
  httpGetAsync(
    "googlebb7e3fa23640d3b2.html",

    function (response) {
      var elt = document.getElementById("google-auth-check");
      //console.log(response);
      if (response === "google-site-verification: googlebb7e3fa23640d3b2.html") {
        console.log("auth ok");
        elt.style.color = "green";
        elt.innerHTML += "OK";
      } else {
        console.log("auth no good");
        elt.style.color = "red";
        elt.innerHTML += "missing";
      }
    },

    function(url, resp) {
      var elt = document.getElementById("google-auth-check");
      console.log("failed to GET " + url + " returned " + resp.status.toString());
      console.log("auth no good");
      elt.style.color = "red";
      elt.innerHTML += "missing";
    }
  );
}

function writeConnTimeStats(time) {
  var diff = Math.abs(time["conn_init"] - time["conn_finish"]);
  console.log("connection to the CDN took " + diff.toString() + "msec");
}

function checkCatnipCDNStatusOk() {
  httpPostAsync(
    /* developer env vs production server */
    null !== window.location.href.match(/^http:\/\/localhost:(3000|8080).*$/)
    ? "http://localhost:8080"
    : "https://catnipcdn.pagekite.me",

    function (response) {
      //console.log(response);
      var rsp = JSON.parse(response),
          elt = document.getElementById("cdn-api-check");
      rsp["time"]["conn_finish"] = +new Date();
      console.log(rsp);

      if (
          (rsp["response"]         === "reply_ping") &&
          (rsp["data"]["pingback"] === true)
      ) {
        console.log("catnip ok");
        writeConnTimeStats(rsp["time"]);
        elt.style.color = "green";
        elt.innerHTML += "OK";

      } else {
        console.log("catnip no good");
        elt.style.color = "red";
        elt.innerHTML += "missing";
      }
    },

    function (url, resp) {
      var elt = document.getElementById("cdn-api-check");
      console.log("failed to POST to " + url + " returned " + resp.status.toString());
      console.log("catnip no good");
      elt.style.color = "red";
      elt.innerHTML += "missing";
    },

    JSON.stringify(
      {
        "verb": "ping",
        "data": {
          "ping": "hello",
        },
        "time": {
          "conn_init": +new Date(),
          "conn_finish": null
        }
      }
    )
  );
}

function loadContent(page) {
  httpGetAsync(
    "views/" + page + ".html",

    function (response) {
      // need to animate this somehow
      var inject = response;
      document.getElementById("buttonWrapper").innerHTML = inject;
    },

    function (url, req) {
      console.log("failed to inject " + page + ".html");
      // well this ocurrence is a developer screw up so idk what else to put here
    }

  );

}

function showGLogin() {
  document.getElementById("bigcircle").style.display = "none";
  document.getElementById("glogin").style.display    = "inline-block";
}

function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  console.log("clicked sign in");
  document.getElementById("signout-button").style.display = "inline-block";

  //This is to make the new buttons appear~
  function showButtons() {

    var i = document.getElementsByClassName("block").length;

    for(var x = 0; x < i; x++) {
      document.getElementsByClassName("block")[x].removeAttribute = ("hidden");
      console.log("unhid block " + x);
    }

  }
  //

  var profile = googleUser.getBasicProfile();
  clid = profile.getId();
  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  //console.log("ID Token: " + id_token);

  httpPostAsync(
    "https://catnipcdn.pagekite.me",
    function (response) {
      var info = JSON.parse(response);
      console.log(info);
    },
    function (url, req) {
      console.log(req.responseText);
    },
    JSON.stringify({
      'verb': 'gapi_validate',
      'data': {
        'gapi_key': id_token
      },
      "time": {
        "conn_init": +new Date(),
        "conn_finish": null
      }
    })
  );
};
function onFailure(error) {
  console.log(error);
}
function renderButton() {
  gapi.signin2.render('glogin', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSignIn,
    'onfailure': onFailure
  });
}
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    document.getElementById("google-signin").style.display = "none";
  });
}


function haveJS () {
  console.log("have JS (duh)");
  document.getElementById("alert").style.display = "none";
  document.getElementById("buttonWrapper").style.display = "inherit";
}

function bodyLoader() {
  // faster
  async(haveJS, function () {
    async(checkGoogleAuthVerificationExists, checkCatnipCDNStatusOk);
  });
  //haveJS(); checkGoogleAuthVerificationExists();
}
