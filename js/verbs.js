googleAPIFile = {
  ok:
    function (response) {
      var elt = document.getElementById("google-auth-check");
      //console.log(response);
      if (response === "google-site-verification: googlebb7e3fa23640d3b2.html") {
        console.log("auth ok");
        elt.style.color = "green";
        elt.innerHTML += " OK";
      } else {
        console.log("auth no good");
        elt.style.color = "red";
        elt.innerHTML += " missing";
      }
    },
  err:
    function(url, resp) {
      var elt = document.getElementById("google-auth-check");
      console.log("failed to GET " + url + " returned " + resp.status.toString());
      console.log("auth no good");
      elt.style.color = "red";
      elt.innerHTML += " missing";
    }
};

catnipCDNUp = {
  ok:
    function (response) {
      //console.log(response);
      var rsp = JSON.parse(response),
          elt = document.getElementById("cdn-api-check");
      rsp["time"]["conn_finish"] = microTime();
      console.log(rsp);

      if (
          (rsp["response"]         === "reply_ping") &&
          (rsp["data"]["pingback"] === true)
      ) {
        console.log("catnip ok");
        writeConnTimeStats(rsp["time"]);
        elt.style.color = "green";
        elt.innerHTML += " OK";

      } else {
        console.log("catnip no good");
        elt.style.color = "red";
        elt.innerHTML += " missing";
      }
    },
  err:
    function (url, resp) {
      var elt = document.getElementById("cdn-api-check");
      console.log("failed to POST to " + url + " returned " + resp.status.toString());
      console.log("catnip no good");
      elt.style.color = "red";
      elt.innerHTML += " missing";
    }
};

defaultJSONObjs = {
  ping: function () {
    return {
      "verb": "ping",
      "data": {
        "ping": "hello",
      },
      "time": {
        "conn_init": microTime(),
        "conn_finish": null
      }
    }
  },

  initial_gapi_validate: function(tok) {
    return {
      'verb': 'gapi_validate',
      'data': {
        'gapi_key': tok
      },
      "time": {
        "conn_init": microTime(),
        "conn_finish": null
      }
    }
  }
};