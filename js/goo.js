function onSignIn(googleUser) {
  console.log("clicked sign in");
  var circle = document.getElementById("bigcircle");
  if (circle) {
    circle.removeEventListener("click", showGLogin);
    writeBigButtonMsg("Please wait...", "taking too long? refresh the page");
  }

  /* global */ currentGoogleUser        = {};
  /* global */ currentGoogleUser.vendor = googleUser;
  /* global */ currentGoogleUser.reload = googleUser.reloadAuthResponse;

  var id_token = googleUser.getAuthResponse().id_token;

  httpPostAsync(
    getServerHostForEnv(),
    function (response) {
      var info = JSON.parse(response);
      console.log(info);

      anticsrf = info.data.anticsrf;

      // NOTE: VALIDATE THIS
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
  console.log("rendered");
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
  if (! confirm("Really sign out of Mineral Springs?")) {
    return;
  }
  var btnwrp = document.getElementById("buttonWrapper");
  signOut();
  /* trigger a refresh instead of keeping the same call stack */
  window.location.reload();
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();

  auth2.signOut().then(function () {
    console.log('User signed out.');
    //document.getElementById("google-signin").style.display = "none";
  });
}

