var editOrderForm = {

  writeMenuData: function () {
    console.log("writing menu data");
    httpPostAsync(
      getServerHostForEnv(),
      function (r) {console.log(r);},
      function () { },
      JSON.stringify(defaultJSONObjs.view_menu())
    );
  }
};