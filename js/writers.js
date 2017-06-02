function loadContent(page) {
  callLoader(function () {

    var pmap = {
      "menu": "menuviewer",
      "edit": "editinput",
      "order": "orderinput",
      "about": "aboutpage"
    };

    hideElements("block");

    var pname = "views/load_" + pmap[page] + ".html";
    httpGetAsync(
      pname,
      function (response) {
        // need to animate this somehow
        var inject = response;
        document.getElementById("buttonWrapper").insertAdjacentHTML("beforeend", inject);
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
    mainPageLoader
  );

}

function mainPageLoader () {

  var fnames = [ "bigbuttons" ];

  if (null !== currentGoogleUser) {
    fnames.push(
      [ "aboutbutton", "updatebutton" ][ + currentGoogleUser.nih_info.is_elevated ]
    );
  }

  var btnWrp = document.getElementById("buttonWrapper");

  while (btnWrp.firstChild) {
    btnWrp.removeChild(btnWrp.firstChild);
  }

  for (fn of fnames) {
    var abspath = "views/pre_" + fn + ".html";
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

function showGLogin() {
  callLoader(function () {
    var circle = document.getElementById("bigcircle");
    circle.parentNode.removeChild(circle);
    document.getElementById("glogin").style.display = "inline-block";
  });
}

function initialLoader() {
  httpGetAsync(
    "views/init_bigcircle.html",
    function (response) {
      document.getElementById("buttonWrapper").insertAdjacentHTML("beforeend", response);
    },

    function (url, req) {
      console.log("failed to inject elt " + abspath);
      // well this ocurrence is a developer screw up so idk what else to put here
    }

  );

}
