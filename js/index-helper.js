var current_google_user = null;
var view_is_home = false;
var anticsrf = {};

function write_conntime(time) {
  var diff = Math.abs(time["conn_init"] - time["conn_finish"]);
  console.log("connection to the CDN took " + (diff / Math.pow(10, 3)).toString() + "msec");
}

function check_cdn_up() {
  http.nosync.post(
    get_env_host(),
    catnip_cdn_up.ok,
    catnip_cdn_up.err,
    JSON.stringify(default_objs.ping())
  );
}

function have_js () {
  var alert = document.getElementById("alert");
  alert.parentNode.removeChild(alert);
  var url = window.location.href;
  url = "/" === url [ url.length - 1 ] ? url.slice(0, url.length - 1) : url;
  document.title += " | " + url;
}

function first_loader() {
  // faster
  have_js();
  async(
    second_loader,
    check_cdn_up
  );
}

function test_forms_offline (elv) {
  current_google_user = { nih_info: { is_elevated: elv } };
  after_glogin_writer();
}

function test_square_ios () {
  var data = {
    "amount_money": {
      "amount" : "500",
      "currency_code" : "USD"
    },
    "callback_url" : "https://catnipcdn.pagekite.me/payment-complete", // Replace this value with your application's callback URL
    "client_id" : "sq0idp-T3wtWA0UKDNW5v4SKRcOrg", // Replace this value with your application's ID
    "version": "1.3",
    "notes": "notes for the transaction",
    "options" : {
      "supported_tender_types" : ["CREDIT_CARD","CASH","OTHER","SQUARE_GIFT_CARD","CARD_ON_FILE"]
    }
  };
  window.location = "square-commerce-v1://payment/create?data=" + encodeURIComponent(JSON.stringify(data));
}