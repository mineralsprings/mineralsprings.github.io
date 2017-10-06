var order_form = {
  write_out_menu: function () {
    var form_grid      = document.getElementById("form-grid"),
        load_text      = document.getElementById("load-text"),
        load_icon      = document.getElementById("load-icon"),
        menu_json_text = order_form.fetch_menu_data(),
        menu_json      = JSON.parse(menu_json_text).data,
        buffet_warn    = document.getElementById("buffet-userwarn"),
        menu_ctime     = microToDateStr(menu_json.effective),
        menu_dtime     = microToDateStr(menu_json.expires);

    //console.log( menu_json );

    if (menu_json.is_buffet) {
      buffet_warn.style.display = "block";
    }


    /*
    PART 1: FIRST STATIC HTML SECTION
    */

    /*

    PART 3: FINAL STATIC HTML SECTIONS

    */
    var final_static = {
      stubs: [
        "timestamp"
      ],
      htmls: [],
      repls: [
        ["MENU_CTIME", menu_ctime],
        ["MENU_DTIME", menu_dtime]
      ]
    };

    for (var i = 0; i < final_static.stubs.length; i++) {
      final_static.htmls.push( httpGetSync( "views/stubs/order/" + final_static.stubs[i] + ".html") );
    }

    console.log(final_static.htmls);

    for (var i = 0; i < final_static.htmls.length; i++) {
      for (var j = 0; j < final_static.repls.length; j++) {
        final_static.htmls[i] = final_static.htmls[i].replace( final_static.repls[j][0], final_static.repls[j][1] );
      }
    }

    for (var i = 0; i < final_static.htmls.length; i++) {
      form_grid.insertAdjacentHTML("beforeend", final_static.htmls[i]);
    }

    load_text.style.display = "none";
    load_icon.style.display = "none";
    form_grid.style.display = "block";
  },

  fetch_menu_data: function () {
    return httpPostSync(getServerHostForEnv(), JSON.stringify( defaultJSONObjs.view_menu() ) );
  }

};
