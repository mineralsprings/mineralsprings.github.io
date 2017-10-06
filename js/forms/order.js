var formOrder = {
  writeOutMenu: function () {
    var form_grid      = document.getElementById("form-grid"),
        load_text      = document.getElementById("load-text"),
        load_icon      = document.getElementById("load-icon"),
        menu_json_text = formOrder.getRemoteMenuData(),
        menu_json      = JSON.parse(menu_json_text).data,
        buffet_warn    = document.getElementById("buffet-userwarn"),
        menu_ctime     = microToDateStr(menu_json.effective),
        menu_dtime     = microToDateStr(menu_json.expires);

    //console.log( menu_json );

    if (menu_json.is_buffet) {
      buffet_warn.style.display = "block";
    }

    var stub_names = [
      "timestamp"
    ];

    var htmls = [];

    for (var i = 0; i < stub_names.length; i++) {
      htmls.push( httpGetSync( "views/stubs/order/" + stub_names[i] + ".html") );
    }

    // can't iterate over objects but it's ok
    var repls = [
      ["MENU_CTIME", menu_ctime],
      ["MENU_DTIME", menu_dtime]
    ];

    for (var i = 0; i < htmls.length; i++) {
      for (var j = 0; j < repls.length; j++) {
        //console.log(htmls[i].match(repls[j][0]));
        htmls[i] = htmls[i].replace( repls[j][0], repls[j][1] );
      }
    }

    for (var i = 0; i < htmls.length; i++) {
      form_grid.insertAdjacentHTML("beforeend", htmls[i]);
    }

    load_text.style.display = "none";
    load_icon.style.display = "none";
    form_grid.style.display = "block";
  },

  getRemoteMenuData: function () {
    return httpPostSync(getServerHostForEnv(), JSON.stringify( defaultJSONObjs.view_menu() ) );
  }

};
