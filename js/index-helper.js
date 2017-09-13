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
  var url = window.location.href;
  url = "/" === url[url.length - 1] ? url.slice(0, url.length - 1) : url;
  document.title += " | " + url;
}

function firstLoader() {
  // faster
  haveJS();
  async(
    initialLoader,
    checkCatnipCDNStatusOk
  );
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

function testSquareIPOS () {
  var dataParameter = {
    "amount_money": {
      "amount" : "500",
      "currency_code" : "USD"
    },
    "callback_url" : "https://catnipcdn.pagekite.me/integrate/square", // Replace this value with your application's callback URL
    "client_id" : "sq0idp-T3wtWA0UKDNW5v4SKRcOrg", // Replace this value with your application's ID
    "version": "1.3",
    "notes": "notes for the transaction",
    "options" : {
      "supported_tender_types" : ["CREDIT_CARD","CASH","OTHER","SQUARE_GIFT_CARD","CARD_ON_FILE"]
    }
  };
  window.location = "square-commerce-v1://payment/create?data=" + encodeURIComponent(JSON.stringify(dataParameter));
}