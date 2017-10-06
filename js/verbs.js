/*gapi_file = {
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
};*/

catnip_cdn_up = {
  ok: function (response) {
    var rsp = JSON.parse(response),
        elt = document.getElementById("cdn-api-check");
    rsp["time"]["conn_finish"] = micro.time();
    /*console.log(rsp);*/

    if (
        (rsp["response"]         === "reply_ping") &&
        (rsp["data"]["pingback"] === true)
    ) {
      enable_glogin_btn();
      console.log("catnip ok");
      write_conntime(rsp["time"]);
      elt.style.color = "green";
      elt.innerHTML += " UP";
    } else {
      catnip_cdn_up.cdn_no_good()
    }
  },

  err: function (url, resp) {
    check_cdn_up.cdn_no_good()
  },

  cdn_no_good: function () {
    console.log("catnip no good");

    var elt = document.getElementById("cdn-api-check");
    elt.style.color = "red";
    elt.innerHTML += " DOWN";
    document.getElementById("bigcircle").addEventListener("mousedown", function() {
      alert("Sorry, your request cannot be processed, because the server (" + getServerHostForEnv() + ") is down for maintenance. Try again later.");
    });
  }
};

default_objs = {
  ping: function () {
    return {
      "verb": "ping",
      "data": {
        "ping": "hello",
      },
      "time": {
        "conn_init": micro.time(),
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
        "conn_init": micro.time(),
      }
    }
  },

  view_menu: function () {
    return {
      "verb": "view_menu",
      "data": {},
      "time": {
        "conn_init": micro.time()
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
        "conn_init": micro.time()
      },
      "anticsrf": (anticsrf.tok || "")
    }
  },

  edit_menu: function (formdata, gapi_info) {
    return {
      "verb": "edit_menu",
      "data": {
        "menu_data": formdata || {},
        "gapi_token": current_google_user.vendor.Zi.id_token || ""
      },
      "time": {
        "conn_init": micro.time()
      },
      "anticsrf": (anticsrf.tok || "")
    }
  }
};
