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

      console.log(rsp);

      if (
          (rsp["response"]         === "ping_reply") &&
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
