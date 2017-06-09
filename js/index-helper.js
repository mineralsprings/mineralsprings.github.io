var currentGoogleUser = null;
var viewIsHome = false;
var anticsrf = {};

function writeConnTimeStats(time) {
  var diff = Math.abs(time["conn_init"] - time["conn_finish"]);
  console.log("connection to the CDN took " + (diff / Math.pow(10, 3)).toString() + "msec");
}

function checkCatnipCDNStatusOk() {
  httpPostAsync(
    getServerHostForEnv(),
    catnipCDNUp.ok,
    catnipCDNUp.err,
    JSON.stringify(defaultJSONObjs.ping())
  );
}

function haveJS () {
  var alert = document.getElementById("alert");
  alert.parentNode.removeChild(alert);
}

function firstLoader() {
  // faster
  haveJS();
  async(
    initialLoader,
    checkCatnipCDNStatusOk);
}

/*function doLoadingIconToggle (state, name) {
  console.log("loading " + (state ? "on" : "off") + " caller: " + name);
  document.getElementById("loading").style.display = state ? "inline-block" : "none";
}

function callLoader(fun) {
  doLoadingIconToggle(true, fun.name);
  fun();
  doLoadingIconToggle(false, fun.name);
}*/

function testFormsOffline (elv) {
  currentGoogleUser = { nih_info: { is_elevated: elv } };
  afterGLoginWriter();
}
