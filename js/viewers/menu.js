var view_menu = {
  write_out_menu: function () {
    console.log("writing menu data");

    http.nosync.post(
      get_env_host(),
      function (r) {
        console.log(r);
        var data = JSON.parse(r);
        if (data.is_buffet) {
          document.getElementById("buffet-userwarn").removeAttribute("hidden");
        }
      },
      function () {
        console.log("error!");
      },
      JSON.stringify(default_objs.view_menu())
    );
  }
};