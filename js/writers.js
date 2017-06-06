function removeChildren(elt) {
  while (elt.firstChild) {
    elt.removeChild(elt.firstChild);
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

      if ("forms/menu" === page) {
        document.getElementById("default-special-checkbox").addEventListener("click", function (e) {
          if ("INPUT" === e.target.nodeName) {
            editMenuForm.doSpecialCheckBox(e.target.parentElement);
          }
        })
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

    var fnames = [ "big2" ];


    fnames.push(
      [ "user", "admin" ][ + ((currentGoogleUser || {}).nih_info || {}).is_elevated || 0  ]
    );

    var btnWrp = document.getElementById("buttonWrapper");

    removeChildren(btnWrp);

    for (var fn of fnames) {
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
  }
}

function showGLogin() {
  var circle = document.getElementById("bigcircle");
  circle.parentNode.removeChild(circle);
  var glogin = document.getElementById("googleSignInWrapper");
  glogin.style.display = "inline-block";
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
  circle.addEventListener("click", showGLogin);

  document.getElementById("c_bigtext").innerHTML = "Login to Google";
  document.getElementById("c_liltext").innerHTML = "login to use this app";
}