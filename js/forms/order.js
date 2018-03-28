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
  return (+num).toFixed(2);
};

var order_form = {

  item_data: [],

  write_out_menu: function () {
    var form_grid      = document.getElementById("form-grid"),
        load_text      = document.getElementById("load-text"),
        load_icon      = document.getElementById("load-icon"),
        menu_json_text = fetch_menu_data(),
        menu_json      = JSON.parse(menu_json_text).data[0],
        menu_ctime     = micro.to_date_str(menu_json.effective),
        menu_dtime     = micro.to_date_str(menu_json.expires),

        stub_names = [
          "buffet",
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

    form_grid.innerHTML = "";


    /*

    PART 1: FIRST STATIC HTML SECTION

    */

    // for now just "buffet" and "top"
    form_grid.insertAdjacentHTML("beforeend", stub_cache["buffet"]);
    form_grid.insertAdjacentHTML("beforeend", stub_cache["legend/top"]);

    if (menu_json.is_buffet) {
      document.getElementById("buffet-userwarn").style.display = "block";
    }
    /*

    PART 2: NON-STATIC HTML AND BUTTONS

    */

    var menu_items = [],
        item_list  = menu_json.item_list,
        items_keys = Object.keys(item_list); // error here

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

      var std_row = stub_cache["std"];

      for (var k = 0; k < dyn_repls.length; k++) {
        std_row = std_row.replace(
          new RegExp(dyn_repls[k][0], "g"),
          dyn_repls[k][1] // that's a 1 not an L
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

    order_form.register_click_handlers();
    load_text.style.display = "none";
    load_icon.style.display = "none";
    form_grid.style.display = "block";
  },

  register_click_handlers: function () {

    /* do + / - buttons */
    var
      plus  = "mako_btn_plus_",
      minus = "mako_btn_minus_",
      ps    = document.querySelectorAll(".mako-plus"),
      ms    = document.querySelectorAll(".mako-minus");

    for (var i = 0; i < ps.length; i++) {
      ps[i].addEventListener("click", order_form.click_handlers.plus);
      ms[i].addEventListener("click", order_form.click_handlers.minus);
    }

    /* do dropdowns */
    var dropdowns = document.querySelectorAll(".mako-dropdown");
    for (var i = 0; i < dropdowns.length; i++) {
      dropdowns[i].addEventListener("change", order_form.click_handlers.update_dropdown);
    }

    /* do submit / clear buttons */
    document.getElementById("mako_btn_fin_submit").addEventListener("click", order_form.click_handlers.submit_selections);
    document.getElementById("mako_btn_fin_clear").addEventListener("click", order_form.click_handlers.clear_all_selections);

  },

  click_handlers: {
    plus: function () {
      var
        own_id  = this.id,
        match   = own_id.match( /mako_btn_plus_(\d+)(?:_(.+))?/ ),
        name_tl = "mako_totalpriceval_" + match[1] + (undefined !== match[2] ? "_" + match[2] : ""),
        name_ct = "mako_dropdown_" + match[1] + (undefined !== match[2] ? "_" + match[2] : "");

      var drop = document.getElementById(name_ct).firstElementChild;
      ++drop.selectedIndex;

      var ni = drop.options[drop.selectedIndex].value;

      var price = 0;
      if ( undefined !== match[2] ) {
        price = order_form.item_data[ match[1] ].options[ match[2] ] * ni;
      } else {
        price = order_form.item_data[ match[1] ].price * ni;
      }

      document.getElementById(name_tl).innerHTML = float_to_aligned_str(price);
      order_form.write_all_finvals();
    },

    minus: function () {
      var
        own_id  = this.id,
        match   = own_id.match( /mako_btn_minus_(\d+)(?:_(.+))?/ ),
        name_tl = "mako_totalpriceval_" + match[1] + (undefined !== match[2] ? "_" + match[2] : ""),
        name_ct = "mako_dropdown_" + match[1] + (undefined !== match[2] ? "_" + match[2] : "");

      var drop = document.getElementById(name_ct).firstElementChild;
      if (drop.selectedIndex >= 1) {
        --drop.selectedIndex;
      }

      var ni = drop.options[drop.selectedIndex].value;

      var price = 0;
      if ( undefined !== match[2] ) {
        price = order_form.item_data[ match[1] ].options[ match[2] ] * ni;
      } else {
        price = order_form.item_data[ match[1] ].price * ni;
      }

      document.getElementById(name_tl).innerHTML = float_to_aligned_str(price);

      order_form.write_all_finvals();
    },

    submit_selections: function () {
      var order = order_form.gather_selection_data();

      // [] != []
      if ( ! order.length ) {
        alert("Nothing selected\nSelect items to create an order");
        return;
      }

      var resp = http.sync.post(get_env_host(), JSON.stringify(default_objs.open_order(order)));
      // do something with the response
    },


    clear_all_selections: function () {
      // refresh the menu
      document.getElementById("form-grid").style.display = "none";
      document.getElementById("form-grid").innerHTML = "";
      order_form.write_out_menu();
    },

    update_dropdown: function () {
      var
        own_id  = this.parentNode.id,
        count   = this.options[this.selectedIndex].value,
        match   = own_id.match( /mako_dropdown_(\d+)(?:_(.+))?/ );
      console.log(own_id);
      var name_tl = "mako_totalpriceval_" + match[1] + (undefined !== match[2] ? "_" + match[2] : "");


      var price = 0;
      if ( undefined !== match[2] ) {
        price = order_form.item_data[ match[1] ].options[ match[2] ] * count;
      } else {
        price = order_form.item_data[ match[1] ].price * count;
      }

      document.getElementById(name_tl).innerHTML = float_to_aligned_str(price);

      order_form.write_all_finvals();
    }
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

    total: function () {
      var st = 0;
      for (var i = 0; i < order_form.item_data.length; i++) {
        var res = order_form.calculate.subtotal_by_id(i);
        st += res[0] + res[1];
      }

      return st;
    },

  },

  write_finval: function (name) {
    var val       = order_form.calculate[name](),
        align_fun = "items" === name ? function(a) { return a; } : float_to_aligned_str;

    document.getElementById("mako_fin_" + name + "val").innerHTML = align_fun(val);
  },

  write_all_finvals: function () {
    var fields = [
      "items", "total"
    ];

    for (var i = 0; i < fields.length; i++) {
      order_form.write_finval(fields[i]);
    }
  },

  gather_selection_data: function () {
    var sels = [];

    for (var i = 0; i < order_form.item_data.length; i++) {
      var id = "mako_dropdown_" + i, drop = document.getElementById(id).firstChild;

      if (drop.selectedIndex > 0) {
        sels[i] = [ +drop.options[drop.selectedIndex].value, {} ];

        var opts = order_form.item_data[i].options, opt_keys = Object.keys(opts);
        for (var j = 0; j < opt_keys.length; j++) {
          var
            opt_name = opt_keys[j],
            opt_drop = document.getElementById(id + "_" + opt_name).firstChild;
          if (opt_drop.selectedIndex > 0) {
            sels[i][1][opt_name] = opt_drop.options[opt_drop.selectedIndex].value;
          }
        }
      }
    }
    return sels;
  }

};
