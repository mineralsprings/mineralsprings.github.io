var viewMenuData = {
  writeMenuData: function () {
    console.log("writing menu data");

    http.nosync.post(
      getServerHostForEnv(),
      function (r) {
        var data = JSON.parse(r);
        if (data.is_buffet) {
          document.getElementById("buffet-userwarn").removeAttribute("hidden");
        }
      },
      function () {
        console.log("error!");
      },
      JSON.stringify(defaultJSONObjs.view_menu())
    );
  }
};