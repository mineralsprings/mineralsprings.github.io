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

        var       il = menudata.item_list,
          contentdiv = document.getElementById("menu-content"),
          counterdiv = document.getElementById("menu-counter-column");

        for (var i = 0; i < il.length; i++) {
          var item = il[i];
          contentdiv.insertAdjacentHTML("beforeend",
            '<div class="menu-display-row" id="menu-itemrow-' + item.sort_id +
            '" onclick="editOrderForm.toggleCountBox(' +
            item.sort_id + ')">' + item.fullname + " " + item.comment + '</div><br>'
          );
          counterdiv.insertAdjacentHTML(
            "beforeend",
            '<label class="menu-display-price" id="menu-itemprice-' + item.sort_id +
            '"> $' + item.price +
            ' <input type="number" class="menu-display-count" id="menu-itemct-' + item.sort_id +
            '"value="0" placeholder="0" oninput="editOrderForm.updatePriceVal(' + item.sort_id +
            ')" hidden/> </label> <br>'
          );
        }

      },
      function () {
        console.log("error!");
      },
      JSON.stringify(defaultJSONObjs.view_menu())
    );
    document.getElementById("loadtext").style.display = "none";
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
  },

  updatePriceVal: function () {
    return false;
  }
};