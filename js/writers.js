function removeChildren(elt) {
  while (elt.firstChild) {
    elt.removeChild(elt.firstChild);
  }
}

function loadContent(page) {
  viewIsHome = false;
  callLoader(function () {

    hideElements("block");

    var pname = "views/load_" + page + ".html";
    httpGetAsync(
      pname,
      function (response) {
        // need to animate this somehow
        var inject = response;
        btnwrp = document.getElementById("buttonWrapper");

        removeChildren(btnwrp);

        btnwrp.insertAdjacentHTML("beforeend", inject);
      },

      function (url, req) {
        console.log("failed to inject " + pname);
        // well this ocurrence is a developer screw up so idk what else to put here
      }
    );
  })
}

function afterGLoginWriter() {
  async(
    function() {
      var elems = [
        document.getElementById("googleSignInWrapper"),
        document.getElementById("bigcircle")
      ];

      for (e of elems) {
        if (e) {
          e.parentNode.removeChild(e);
        }
      }
    },
    async(mainPageLoader,
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

    var fnames = [ "big" ];

    if (null !== currentGoogleUser) {
      fnames.push(
        [ "user", "admin" ][ + currentGoogleUser.nih_info.is_elevated ]
      );
    }

    var btnWrp = document.getElementById("buttonWrapper");

    removeChildren(btnWrp);

    for (fn of fnames) {
      var abspath = "views/pre_btn_" + fn + ".html";
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
  }
}

function showGLogin() {
  callLoader(function () {
    var circle = document.getElementById("bigcircle");
    circle.parentNode.removeChild(circle);
    document.getElementById("glogin").style.display = "inline-block";
  });
}

function initialLoader() {
  httpGetAsync(
    "views/init_btn_bigcircle.html",
    function (response) {
      document.getElementById("buttonWrapper").insertAdjacentHTML("beforeend", response);
    },

    function (url, req) {
      console.log("failed to inject elt " + abspath);
      // well this ocurrence is a developer screw up so idk what else to put here
    }

  );

}

function doSignOut () {
  if (! confirm("Are you sure you would like to sign out of Mineral Springs?")) {
    return;
  }
  var btnwrp = document.getElementById("buttonWrapper");
  removeChildren(btnwrp);
  signOut();
  /*firstLoader(); trigger a refresh instead */
  window.location.reload();
}