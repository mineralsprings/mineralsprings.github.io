var currentGoogleUser = null;
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


function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  console.log("clicked sign in");

  currentGoogleUser = {};
  currentGoogleUser.vendor = googleUser;

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
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSignIn,
    'onfailure': function (error) { console.log(error); }

  });
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();

  auth2.signOut().then(function () {
    console.log('User signed out.');
    //document.getElementById("google-signin").style.display = "none";
  });
}

function haveJS () {
  console.log("have JS (duh)");
  var alert = document.getElementById("alert");
  alert.parentNode.removeChild(alert);
  /*document.getElementById("buttonWrapper").style.display = "inherit";*/
}

function firstLoader() {
  // faster
  async(
    haveJS,
    async(
      function () {
        async(checkGoogleAuthVerificationExists, checkCatnipCDNStatusOk);
      },
      initialLoader
    )
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

window.onbeforeunload = function () {
  mainPageLoader();
  return true;
}