function loadContent(page) {
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
      document.getElementById("buttonWrapper")[0].innerHTML += inject;
    },

    function (url, req) {
      console.log("failed to inject " + pname);
      // well this ocurrence is a developer screw up so idk what else to put here
    }

  );

}

function afterGLoginWriter() {
  var fnames = [ "aboutbutton", "bigbuttons", "updatebutton" ];
  for (var i = 0; i < fnames.length; i++) {
    var abspath = "views/pre_" + fnames[i] + ".html";
    httpGetAsync(
      abspath,
      function (response) {
        // need to animate this somehow
        var inject = response;
        document.getElementById("buttonWrapper")[0].innerHTML += inject;
      },

      function (url, req) {
        console.log("failed to inject elt " + abspath);
        // well this ocurrence is a developer screw up so idk what else to put here
      }

    );
  }

  document.getElementById("googleSignInWrapper").style.display = "none";

/*  var blocks = document.getElementsByClassName("block");

  for(var x = 0; x < blocks.length; x++) {
    blocks[x].style.display = "inline-block";

  }
*/
}

function showGLogin() {
  document.getElementById("bigcircle").style.display = "none";
  document.getElementById("glogin").style.display    = "inline-block";
}
