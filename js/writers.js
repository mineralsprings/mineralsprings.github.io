function removeChildren(elt) {
  if (elt) {
    while (elt.firstChild) {
      elt.removeChild(elt.firstChild);
    }
  }
}

function loadContent(page) {
  viewIsHome = false;

  hideElements("block");

  var pname = "views/" + page + ".html";
  httpGetAsync(
    pname,
    function (response) {
      // need to animate this somehow
      var inject = response;
      btnwrp = document.getElementById("buttonWrapper");

      removeChildren(btnwrp);

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
          editOrderForm.writeMenuData();
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

function afterGLoginWriter() {
  async(
    function() {
      var elems = [
        document.getElementById("googleSignInWrapper"),
        document.getElementById("bigcircle")
      ];

      for (var i = 0; i < elems.length; i++) {
        var e = elems[i];
        if (e) {
          e.parentNode.removeChild(e);
        }
      }
    },
    async(
      mainPageLoader,
      function () {
        var probutton = document.getElementById("profileButton");
        probutton.style.backgroundImage = "url(" + currentGoogleUser.nih_info.picture + ")";
        probutton.style.display = "inline-block";
      }
    )
  );
}

function mainPageLoader () {

  if (! viewIsHome) {

    viewIsHome = true;

    var fnames = [ "big2" ];

    fnames.push(
      [ "user", "admin" ][ + ((currentGoogleUser || {}).nih_info || {}).is_elevated || 0  ]
    );

    var btnWrp = document.getElementById("buttonWrapper");

    removeChildren(btnWrp);

    for (var i = 0; i < fnames.length; i++) {
      var fn = fnames[i];
      var abspath = "views/btns/" + fn + ".html";
      httpGetAsync(
        abspath,
        function (response) {
          document.getElementById("buttonWrapper").insertAdjacentHTML("beforeend", response);
        },

        function (url, req) {
          console.log("failed to inject elt " + abspath);
          // well this ocurrence is a developer screw up so idk what else to put here
        }

      );
    }

    var c = document.getElementById("bigcircle");
    if (c) { c.parentElement.removeChild(c); }
  }
}

function showGLogin() {
  var
    circle     = document.getElementById("bigcircle"),
    in_wrapper = document.getElementById("googleSignInWrapper");
  if (circle && in_wrapper) {
    circle.parentNode.removeChild(circle);
    in_wrapper.style.display = "block";
  }
}

function initialLoader() {
  httpGetAsync(
    "views/btns/bigcircle.html",
    function (response) {
      document.getElementById("buttonWrapper").insertAdjacentHTML("beforeend", response);
    },

    function (url, req) {
      console.log("failed to inject elt " + abspath);
      // well this ocurrence is a developer screw up so idk what else to put here
    }
  );
}

function enableBigButton() {
  var circle  = document.getElementById("bigcircle");
  if (circle) {
    circle.addEventListener("click", showGLogin);
    writeBigButtonMsg("Login to Google", "login to use this app");
  }
}

function writeBigButtonMsg(big, small) {
  var
    b = document.getElementById("c_bigtext"),
    s = document.getElementById("c_liltext");
  if (b && s) {
    b.innerHTML = big;
    s.innerHTML = small;
  }
}