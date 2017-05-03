function checkGoogleAuthVerificationExists() {
  httpGetAsync("googlebb7e3fa23640d3b2.html", function (response) {
    //console.log(response);
    if (response === "google-site-verification: googlebb7e3fa23640d3b2.html") {
      console.log("auth ok");
      document.getElementById("google-auth-check").innerHTML += " <font color='green'>status GOOD</font>";
    } else {
      console.log("auth no good");
      document.getElementById("google-auth-check").innerHTML += " <font color='red'>status BAD</font>";
    }
  });
}

function haveJS () {

  document.getElementById('alert').style.display = 'none';
  document.getElementById('buttonWrapper').style.display = 'inherit';

  //console.log(document.getElementById('alert').style.display);
}

function bodyLoader() {
  // faster
  async(checkGoogleAuthVerificationExists, haveJS);
  //haveJS(); checkGoogleAuthVerificationExists();
}
