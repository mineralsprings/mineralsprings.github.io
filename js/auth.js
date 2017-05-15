function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  console.log("clicked sign in");

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

  /*console.log("ID: " + clid); // Don't send this directly to your server!
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());
  */
  /*  var writehi_output = function (arg) {
      console.log(arg);
      var acc = JSON.parse(arg);
      var id = acc["email"].split("@")[0];
      document.getElementById("output").innerHTML =
        "Hi, " + acc["given_name"] + ".<br />You are"
        + (acc["hd"] === "sau9.org" ? "" : "n't") + " part of SAU9 and your ID, "
        + id + ", is"
        + (ID_LIST[id] !== undefined ? "" : "n't") + " authorised to edit the menu.";
    }
    var fulluri = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + id_token;
    console.log(fulluri);
    httpGetAsync(fulluri, writehi_output);
  */
};

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    document.getElementById("output").innerHTML = "";
  });
}
