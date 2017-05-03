function checkGoogleAuthVerificationExists() {
  console.log("checking auth functioning...");
  httpGetAsync("googlebb7e3fa23640d3b2.html", function (response) {
    console.log(response);
    if (response === "google-site-verification: googlebb7e3fa23640d3b2.html") {
      document.getElementById("google-auth-check").innerHTML += " <font color='green'>status GOOD</font>";
    } else {
      document.getElementById("google-auth-check").innerHTML += " <font color='red'>status BAD</font>";
    }
  });
}

function writeEditMenuButton() {
  document.getElementById("edit-button").innerHTML = '<a href="auth.html" class="btn">edit the menu</a>';
}

function disableNoJavaScriptWarning () {
  document.getElementById('alert').style.display = 'none';
  console.log(document.getElementById('alert').style.display);
}

function bodyLoader() {
  checkGoogleAuthVerificationExists();
  console.log("Hello");
  writeEditMenuButton();
  disableNoJavaScriptWarning();
}

bodyLoader();