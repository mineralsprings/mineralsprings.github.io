currentGoogleUser = null;

function checkGoogleAuthVerificationExists() {
  httpGetAsync(
    "googlebb7e3fa23640d3b2.html",
    googleAPIFile.ok,
    googleAPIFile.err
  );
}

function writeConnTimeStats(time) {
  var diff = Math.abs(time["conn_init"] - time["conn_finish"]);
  console.log("connection to the CDN took " + diff.toString() + "usec");
}

function checkCatnipCDNStatusOk() {
  httpPostAsync(
    getServerHostForEnv(),
    catnipCDNUp.ok,
    catnipCDNUp.err,
    JSON.stringify(defaultJSONObjs.ping)
  );
}


/* developer env vs production server */
function getServerHostForEnv() {
  return null !== window.location.href.match(/^http:\/\/localhost:(3000|8080).*$/)
    ? "http://localhost:8080"
    : "https://catnipcdn.pagekite.me" ;
}


function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  console.log("clicked sign in");

  currentGoogleUser = googleUser;

  afterGLoginWriter();
  

  var id_token = googleUser.getAuthResponse().id_token;

  httpPostAsync(
    getServerHostForEnv(),
    function (response) {
      var info = JSON.parse(response);
      console.log(info);
    },
    function (url, req) {
      console.log(req.responseText);
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
