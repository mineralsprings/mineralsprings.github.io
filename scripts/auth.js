// NOTE: this is going away in the future, to get the server to supply the validation and the edit.html page
var ID_LIST = {
  "1742119": true,
  "d_richardi": true,
  "v_schrader": true,
};

function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());

  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);

  var writehi_output = function (arg) {
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
};

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  document.getElementById("output").innerHTML = "";
}
