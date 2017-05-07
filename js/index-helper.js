function checkGoogleAuthVerificationExists() {
  httpGetAsync(
    "googlebb7e3fa23640d3b2.html",
    function (response) {
      //console.log(response);
      if (response === "google-site-verification: googlebb7e3fa23640d3b2.html") {
        console.log("auth ok");
        document.getElementById("google-auth-check").style.color = "green";
        document.getElementById("google-auth-check").innerHTML += "OK";
      } else {
        console.log("auth no good");
        document.getElementById("google-auth-check").style.color = "red";
        document.getElementById("google-auth-check").innerHTML += "missing";
      }
    },
    function(url, resp) {
      console.log("failed to GET " + url + " returned " + resp.status.toString());
      console.log("auth no good");
      document.getElementById("google-auth-check").style.color = "red";
      document.getElementById("google-auth-check").innerHTML += "missing";

    }
  );
}

function checkCatnipCDNStatusOk() {
  httpPostAsync(
    "http://catnipcdn.pagekite.me",
    function (repsonse) {
      //console.log(response);
      if (JSON.parse(response)["reply"] === "ok") {
        console.log("catnip ok");
        document.getElementById("cdn-api-check").style.color = "green";
        document.getElementById("cdn-api-check").innerHTML += "OK";
      } else {
        console.log("catnip no good");
        document.getElementById("cdn-api-check").style.color = "red";
        document.getElementById("cdn-api-check").innerHTML += "missing";
      }
    },

    function (url, resp) {
      console.log("failed to POST to " + url + " returned " + resp.status.toString());
      console.log("catnip no good");
      document.getElementById("cdn-api-check").style.color = "red";
      document.getElementById("cdn-api-check").innerHTML += "missing";
    },

    JSON.stringify(
      {"ping": "hello"}
    )
  );
}

function haveJS () {
  console.log("have JS (duh)");
  document.getElementById('alert').style.display = 'none';
  document.getElementById('buttonWrapper').style.display = 'inherit';
}

function bodyLoader() {
  // faster
  async(haveJS, function () {
    async(checkGoogleAuthVerificationExists, checkCatnipCDNStatusOk);
  });
  //haveJS(); checkGoogleAuthVerificationExists();
}
