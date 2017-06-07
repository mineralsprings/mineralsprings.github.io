googleAPIFile = {
  ok:
    function (response) {
      var elt = document.getElementById("google-auth-check");
      //console.log(response);
      if (response === "google-site-verification: googlebb7e3fa23640d3b2.html") {
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
      var rsp = JSON.parse(response),
          elt = document.getElementById("cdn-api-check");
      rsp["time"]["conn_finish"] = microTime();
      /*console.log(rsp);*/

      if (
          (rsp["response"]         === "reply_ping") &&
          (rsp["data"]["pingback"] === true)
      ) {
        enableBigButton();
        console.log("catnip ok");
        writeConnTimeStats(rsp["time"]);
        elt.style.color = "green";
        elt.innerHTML += " OK";
      } else {
        catnipCDNUp.cdn_no_good()
      }
    },
  err:
    function (url, resp) {
      /*console.log("failed to POST to " + url + " returned " + resp.status.toString());*/
      catnipCDNUp.cdn_no_good()
    },

  cdn_no_good:
    function () {
      console.log("catnip no good");

      var elt = document.getElementById("cdn-api-check");
      elt.style.color = "red";
      elt.innerHTML += " missing";
      document.getElementById("bigcircle").addEventListener("mousedown", function() {
        alert("Sorry, your request cannot be processed, because the server (" + getServerHostForEnv() + ") is down for maintenance. Try again later.");
      });
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
      }
    }
  },

  initial_gapi_validate: function(tok) {
    return {
      'verb': 'gapi_validate',
      'data': {
        'gapi_key': (tok || "")
      },
      "time": {
        "conn_init": microTime(),
      }
    }
  },

  view_menu: function () {
    return {
      "verb": "view_menu",
      "data": {},
      "time": {
        "conn_init": microTime()
      },
      "anticsrf": (anticsrf.tok || "")
    }
  },

  view_orders: function (age, count, from_end) {
    return {
      "verb": "view_orders",
      "data": {
        "age": age || "new",           // or old
        "count": count || 10,          // default
        "from_end": from_end || "head" // or tail
      },
      "time": {
        "conn_init": microTime()
      },
      "anticsrf": (anticsrf.tok || "")
    }
  }
};
