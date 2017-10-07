function remove_children(elt) {
  if (elt) {
    while (elt.firstChild) {
      elt.removeChild(elt.firstChild);
    }
  }
}

function load_content(page) {
  view_is_home = false;

  hide_elements("block");

  var pname = "views/" + page + ".html";
  http.nosync.get(
    pname,
    function (response) {
      // need to animate this somehow
      var inject = response;
      var btnwrp = document.getElementById("wrapper-btns");

      remove_children(btnwrp);

      btnwrp.insertAdjacentHTML("beforeend", inject);

      switch (page) {

        case "forms/menu": {
          document.getElementById(
            "default-special-checkbox"
          ).addEventListener(
            "click",
            doOptionsCheckBox
          );
          break;
        }

        case "forms/order": {
          order_form.write_out_menu();
          break;
        }

        default: {
          break;
        }
      }
    },

    function (url, req) {
      console.log("failed to inject " + pname);
      // well this ocurrence is a developer screw up so idk what else to put here
    }
  );
}

function after_glogin_writer() {
  async(
    function() {
      var elems = [
        document.getElementById("google-sign-in-wrapper"),
        document.getElementById("circle-glogin")
      ];

      for (var i = 0; i < elems.length; i++) {
        var e = elems[i];
        if (e) {
          e.parentNode.removeChild(e);
        }
      }
    },
    async(
      mainpage_loader,
      function () {
        document.getElementById("btn-back").style.display = "inherit";
        var probutton = document.getElementById("btn-profile");
        probutton.style.backgroundImage = "url(" + current_google_user.nih_info.picture + ")";
        probutton.style.display = "inline-block";
      }
    )
  );
}

function mainpage_loader () {

  if (! view_is_home) {
    go_home();
  }

  read_qstring();

}

function show_glogin() {
  var
    circle     = document.getElementById("circle-glogin"),
    in_wrapper = document.getElementById("google-sign-in-wrapper");
  if (circle && in_wrapper) {
    circle.parentNode.removeChild(circle);
    in_wrapper.style.display = "block";
  }
}

function second_loader() {
  http.nosync.get(
    "views/btns/bigcircle.html",
    function (response) {
      document.getElementById("wrapper-btns").insertAdjacentHTML("beforeend", response);
    },

    function (url, req) {
      console.log("failed to inject elt " + abspath);
      // well this ocurrence is a developer screw up so idk what else to put here
    }
  );
}

function enable_glogin_btn() {
  var circle  = document.getElementById("circle-glogin");
  if (circle) {
    circle.addEventListener("click", show_glogin);
    write_big_btn_msg("Login to Google", "login to use this app");
  }
}

function write_big_btn_msg(big, small) {
  var
    b = document.getElementById("circle-bigtext"),
    s = document.getElementById("circle-smalltext");
  if (b && s) {
    b.innerHTML = big;
    s.innerHTML = small;
  }
}

function read_qstring() {
  var qs = document.location.search;
  if (undefined === qs) { return; }

  qs = qs.slice(1); // trim leading ?
  read_qstring_impl(qs);
}

function read_qstring_impl(qs) {

  //console.log("query " + qs)
  if ("" === qs) { return; }

  // don't know if this is a good idea
  // but we'll try to prevent infinite recursion
  if ( ("home" === qs) && (!viewIsHome) ) {
    go_home();
    return;
  }

  // human readable names for certain pages
  var nice_names = {
    "make-order": "forms/order",
    "pending": "viewers/order",
    "about": "viewers/about",
    "privacy": "viewers/privacy"
  };

  var tformed = nice_names[qs];
  if (undefined !== tformed) {
    qs = tformed;
  }

  load_content(qs);
}

function go_home() {

  view_is_home = true;

  var fnames = [ "big2" ];

  fnames.push(
    [ "user", "admin" ][ + ((current_google_user || {}).nih_info || {}).is_elevated || 0  ]
  );

  var btn_wrp = document.getElementById("wrapper-btns");

  remove_children(btn_wrp);

  for (var i = 0; i < fnames.length; i++) {
    var fn = fnames[i];
    var abspath = "views/btns/" + fn + ".html";
    http.nosync.get(
      abspath,
      function (response) {
        btn_wrp.insertAdjacentHTML("beforeend", response);
      },

      function (url, req) {
        console.log("failed to inject elt " + abspath);
        // well this ocurrence is a developer screw up so idk what else to put here
      }

    );
  }

  var c = document.getElementById("circle-glogin");
  if (c) { c.parentElement.removeChild(c); }

}