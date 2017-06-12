var editOrderForm = {

  writeMenuData: function () {
    console.log("writing menu data");

    httpPostAsync(
      getServerHostForEnv(),
      function (r) {

        var alldata = JSON.parse(r) || {};
        var menudata = alldata.data;
        if (true === menudata.is_buffet) {
          document.getElementById("buffet-userwarn").removeAttribute("hidden");
        }

        var     il = menudata.item_list;
        var mc_div = document.getElementById("menu-content");

        for (var i = 0; i < il.length; i++) {
          var item = il[i];
          mc_div.insertAdjacentHTML("beforeend",
            '<div class="menu-display-row" id="menu-itemrow-' + item.sort_id +
            '" onclick="editOrderForm.toggleCountBox(' +
            item.sort_id + ')">' + item.fullname + " " + item.comment + " $" + item.price +
            '</div><br>'
          );
          document.getElementById("menu-counter-column").insertAdjacentHTML(
            "beforeend",
            ' <input type="number" class="menu-display-count" id="menu-itemct-' + item.sort_id + '" hidden="true" value="0" placeholder="0" /> <br>'
          );
        }

      },
      function () {
        console.log("error!");
      },
      JSON.stringify(defaultJSONObjs.view_menu())
    );
    document.getElementById("loadtext").setAttribute("hidden", true);
  },

  toggleCountBox: function (n) {
    var ct = document.getElementById("menu-counter-column")
             .querySelector("#menu-itemct-" + n),
       row = document.getElementById("menu-itemrow-" + n);
    if (ct.hidden) {
      ct.removeAttribute("hidden")
      row.style.backgroundColor = "#aaa";
    } else {
      ct.setAttribute("hidden", true);
      row.style.backgroundColor = "white";
    }
  }
};