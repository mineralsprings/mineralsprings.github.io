var viewMenuData = {
  writeMenuData: function () {  
    console.log("writing menu data");

    httpPostAsync(
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