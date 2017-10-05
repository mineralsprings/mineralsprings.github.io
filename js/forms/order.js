/*var editOrderForm = {

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
          var price = item.price.toFixed(2);
          contentdiv.insertAdjacentHTML("beforeend",
            '<div class="menu-display-row" id="menu-itemrow-' + item.sort_id +
            '" onclick="editOrderForm.toggleCountBox(' +
            item.sort_id + ')">' + item.fullname + "<b>$" + item.price + "</b>" + " <br>" + item.comment + '</div><br>'
          );
          counterdiv.insertAdjacentHTML(
            "beforeend",
            '<label class="menu-display-price" id="menu-itemprice-' + item.sort_id +
            '"> $' + item.price + '</label>' +
            ' <input type="number" class="menu-display-count" id="menu-itemct-' + item.sort_id +
            '"value="0" placeholder="0" oninput="editOrderForm.updatePriceVal(' + item.sort_id +
            ')" /> <br>'
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
    if (ct.disabled) {
      ct.removeAttribute("disabled")
      row.style.backgroundColor = "#aaa";
    } else {
      ct.setAttribute("disabled", true);
      row.style.backgroundColor = "inherit";
    }
  },

  updatePriceVal: function (n) {
    var curprice = /\$(\d+\.\d+)/.exec(document.getElementById("menu-itemct-" + n).innerHTML)[1],
           count = document.getElementById("menu-itemprice-" + n).value
  }
};*/