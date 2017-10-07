var order_form = {
  write_out_menu: function () {
    var form_grid      = document.getElementById("form-grid"),
        load_text      = document.getElementById("load-text"),
        load_icon      = document.getElementById("load-icon"),
        menu_json_text = order_form.fetch_menu_data(),
        menu_json      = JSON.parse(menu_json_text).data,
        buffet_warn    = document.getElementById("buffet-userwarn"),
        menu_ctime     = micro.to_date_str(menu_json.effective),
        menu_dtime     = micro.to_date_str(menu_json.expires),

        stub_names = [
          "std",
          "dropdown",
          "timestamp",
          "legend/bottom",
          "legend/top",
          "optgroup/first",
          "optgroup/inner",
          "optgroup/last",
          "final/btns",
          "final/nums",
        ],
        stub_cache = populate_stub_cache(stub_names);

    if (menu_json.is_buffet) {
      buffet_warn.style.display = "block";
    }

    /*

    PART 1: FIRST STATIC HTML SECTION

    */

    // for now just "top"
    form_grid.insertAdjacentHTML("beforeend", stub_cache["legend/top"]);

    /*

    PART 2: NON-STATIC HTML AND BUTTONS

    */

    var menu_items = [],
        item_list  = menu_json.item_list,
        items_keys = Object.keys(item_list);

    // avoid for .. in, for .. of, forEach, etc
    for (var i = 0; i < items_keys.length; i++) {
      var this_item = item_list[ items_keys[i] ];

      this_item.sort_id = (+this_item.sort_id) - 1;

      menu_items[this_item.sort_id] = this_item;
    }

    var dyn_rows = [];

    for (var i = 0; i < menu_items.length; i++) {
      var this_item = menu_items[i];

      var dyn_repls = [
        ["ITEM_NAME", this_item.fullname],
        ["ITEM_DESC", this_item.comment],
        ["ITEM_PRICE", this_item.price],
        ["STATIC_DROPDOWN", stub_cache["dropdown"]],
        ["ENTRY_NUMBER", this_item.sort_id]
      ];

      //console.log(dyn_repls);

      var std_row = stub_cache["std"];

      for (var k = 0; k < dyn_repls.length; k++) {
        std_row = std_row.replace(
          new RegExp(dyn_repls[k][0], "g"),
          dyn_repls[k][1]
        );
      }

      dyn_rows.push(std_row);

      var opt_htmls = [],
          options   = this_item.options,
          opt_keys  = Object.keys(options);

      for (var j = 0; j < opt_keys.length; j++) {
        var type,
          opt_repls = [
            ["OPT_NAME", opt_keys[j] ],
            ["OPT_PRICE", options[ opt_keys[j] ] ],
            ["STATIC_DROPDOWN", stub_cache["dropdown"] ],
            ["ENTRY_NUMBER", this_item.sort_id.toString() + "_" + j.toString() ],
            ["GROUPLAST_PLACEHOLDER", (1 == opt_keys.length) ? "mako-option-grouplast" : ""]
          ];

        if (0 === j) {
          type = "first";
        } else if ( opt_keys.length === j + 1 ) {
          type = "last";
        } else {
          type = "inner";
        }

        var opt_row = stub_cache["optgroup/" + type];

        for (var k = 0; k < opt_repls.length; k++) {
          opt_row = opt_row.replace(
            new RegExp(opt_repls[k][0], "g"),
            opt_repls[k][1]
          );
        }
        opt_htmls[j] = opt_row;
      }


      for (var l = 0; l < opt_htmls.length; l++) {
        dyn_rows.push(opt_htmls[l]);
      }

    }

    /*

    PART 3: FINAL STATIC HTML SECTION

    */

    for (var i = 0; i < dyn_rows.length; i++) {
      form_grid.insertAdjacentHTML("beforeend", dyn_rows[i]);
    }

    var final_dyn = [
      stub_cache["legend/bottom"],
      stub_cache["final/nums"],
      stub_cache["final/btns"]
    ];

    for (var i = 0; i < final_dyn.length; i++) {
      form_grid.insertAdjacentHTML("beforeend", final_dyn[i]);
    }

    var final_static = {
      stubs: [
        "timestamp"
      ],
      htmls: [ ],
      repls: [
        ["MENU_CTIME", menu_ctime],
        ["MENU_DTIME", menu_dtime]
      ]
    };

    for (var i = 0; i < final_static.stubs.length; i++) {
      final_static.htmls.push( stub_cache[ final_static.stubs[i] ] );
    }

    ////console.log(final_static.repls);

    for (var i = 0; i < final_static.htmls.length; i++) {
      for (var j = 0; j < final_static.repls.length; j++) {
        final_static.htmls[i] = final_static.htmls[i].replace(
          new RegExp(final_static.repls[j][0], "g"),
          final_static.repls[j][1]
        );
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
    return http.sync.post(get_env_host(), JSON.stringify( default_objs.view_menu() ) );
  }

};

var stub_element_names = {
  ".": { "std": "std", "dropdown": "dropdown" },
  "legend": { "bottom": "legend/bottom" },
  "option": {
    "first": "optgroup/first",
    "inner": "optgroup/inner",
    "last": "optgroup/last"
  },
  "summary": {
    "buttons": "final/btns",
    "numbers": "final/nums"
  }
};


var get_stub_data = function (stub_name) {
  return http.sync.get( "views/stubs/" + stub_name + ".html");
}

var get_order_stub_data = function (stub_name) {
  return get_stub_data("order/" + stub_name);
}

var elem_name_to_stub_html = function (elem) {
  return get_order_stub_data( stub_element_names[elem] );
}

var populate_stub_cache = function (names) {
  var temp = {};
  for (var i = 0; i < names.length; i++) {
    var n = names[i];
    temp[n] = get_order_stub_data(n);
  };
  return temp;
}