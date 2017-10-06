function on_sign_in(google_user) {
  console.log("clicked sign in");
  var circle = document.getElementById("circle-glogin");
  if (circle) {
    circle.removeEventListener("click", show_glogin);
    write_big_btn_msg("Please wait...", "taking too long? refresh the page");
  }

  /* global */ current_google_user        = {};
  /* global */ current_google_user.vendor = google_user;
  /* global */ current_google_user.reload = google_user.reloadAuthResponse;

  var id_token = google_user.getAuthResponse().id_token;

  http.nosync.post(
    get_env_host(),
    function (response) {
      var info = JSON.parse(response);
      console.log(info);

      anticsrf = info.data.anticsrf;

      // NOTE: VALIDATE THIS
      current_google_user.nih_info = info.data.gapi_info;

      after_glogin_writer();
    },
    function (url, req) {
      console.log("failed " + req);
    },
    JSON.stringify(default_objs.initial_gapi_validate(id_token))
  );
}

function render_button() {
  gapi.signin2.render('glogin', {
    'scope': 'profile email',
    'width': 400,
    'height': 100,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': on_sign_in,
    'onfailure': function (error) { console.log(error); }
  });
}

function do_sign_out() {
  if (! confirm("Really sign out of Mineral Springs?")) {
    return;
  }
  //var btnwrp = document.getElementById("wrapper-btns");
  sign_out();
  /* trigger a refresh instead of keeping the same call stack */
  window.location.reload();
}

function sign_out() {
  var auth2 = gapi.auth2.getAuthInstance();

  auth2.signOut().then(function () {
    console.log('User signed out.');
    //document.getElementById("google-signin").style.display = "none";
  });
}

