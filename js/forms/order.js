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
};

var get_order_stub_data = function (stub_name) {
  return get_stub_data("order/" + stub_name);
};

var elem_name_to_stub_html = function (elem) {
  return get_order_stub_data( stub_element_names[elem] );
};

var populate_stub_cache = function (names) {
  var temp = {};
  for (var i = 0; i < names.length; i++) {
    var n = names[i];
    temp[n] = get_order_stub_data(n);
  };
  return temp;
};

var float_to_aligned_str = function (num) {
  var n = num.toString();
  if (! n.match(/\./) ) {
    return n + ".00";

  } else if ( ! n.match( /\.\d{2}/ ) ) {
    return n + "0";

  } else if ( n.match( /\.\d{3,}/ ) ) {
    return (+n).toFixed(2).toString();

  } else {
    return n;
  }
};

var order_form = {

  item_data: [],

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
      order_form.item_data[this_item.sort_id]  = this_item;
    }

    var dyn_rows = [];

    for (var i = 0; i < menu_items.length; i++) {
      var this_item = menu_items[i];

      var dyn_repls = [
        ["ITEM_NAME", this_item.fullname],
        ["ITEM_DESC", this_item.comment],
        ["ITEM_PRICE", float_to_aligned_str(this_item.price) ],
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
            ["OPT_PRICE", float_to_aligned_str( options[ opt_keys[j] ] ) ],
            ["STATIC_DROPDOWN", stub_cache["dropdown"] ],
            ["ENTRY_NUMBER", this_item.sort_id.toString() + "_" + opt_keys[j].replace(/ /g, "_") ],
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
  },

  register_click_handlers: function () {

  },

  click_handlers: {

  },

  calculate: {

    items_by_id: function (id) {
      var
        data      = order_form.item_data,
        dname     = "mako_dropdown_" + id.toString(),
        drop      = document.getElementById(dname).firstChild,
        tc        = + (drop.options[drop.selectedIndex].value),
        opts      = data[id].options,
        opts_keys = Object.keys(opts),
        opt_ct    = 0,
        opt_enum  = {};

      for (var j = 0; j < opts_keys.length; j++) {
        var
          this_key = opts_keys[j],
          opt_drop = document.getElementById(dname + "_" + this_key).firstChild,
          this_ct  = + (opt_drop.options[opt_drop.selectedIndex].value);

        opt_enum[ this_key ] = this_ct;
        opt_ct += this_ct;
      }

      return [tc, opt_ct, opt_enum];
    },

    items: function () {
      var total_count = 0;

      for (var i = 0; i < order_form.item_data.length; i++) {
        var res = order_form.calculate.items_by_id(i);
        total_count += res[0] + res[1];
      }
      return total_count;
    },

    subtotal_by_id: function (id) {
      var
        data       = order_form.item_data,
        item_cts   = order_form.calculate.items_by_id(id),
        item_price = data[id].price,
        std_total  = item_price * item_cts[0],
        opt_cts    = item_cts[2],
        opt_keys   = Object.keys(opt_cts),
        opt_totals = {},
        opt_sub    = 0;

      for (var i = 0; i < opt_keys.length; i++) {
        var this_key = opt_keys[i],
          this_total = opt_cts[ this_key ] * data[id].options[ this_key ];

        opt_totals[ this_key ] = this_total;
        opt_sub += this_total;
      }

      return [std_total, opt_sub, opt_totals];
    },

    subtotal: function () {
      var st = 0;
      for (var i = 0; i < order_form.item_data.length; i++) {
        var res = order_form.calculate.subtotal_by_id(i);
        st += res[0] + res[1];
      }

      return st;
    },

    tax: function () {
      var s = order_form.calculate.subtotal();
      return s > 0.36 ? s * 0.09 : 0;
    },

    total: function () {
      return order_form.calculate.tax() + order_form.calculate.subtotal();
    }
  },

  write_finval: function (name) {
    var val       = order_form.calculate[name](),
        align_fun = "items" === name ? function(a) { return a; } : float_to_aligned_str;

    console.log(name + " " + val);
    document.getElementById("mako_fin_" + name + "val").innerHTML =
      align_fun(val);
  },

  write_all_finvals: function () {
    var fields = [
      "items", "subtotal", "tax", "total"
    ];

    for (var i = 0; i < fields.length; i++) {
      order_form.write_finval(fields[i]);
    }
  }

};
