var formOrder = {
  writeOutMenu: function () {
    var form_grid = document.getElementById("form-grid"),
        menu_json = formOrder.getRemoteMenuData();

    console.log( menu_json );

    form_grid.style.display = "block";
  },

  getRemoteMenuData: function () {
    return httpPostSync(getServerHostForEnv(), JSON.stringify( defaultJSONObjs.view_menu() ));
  }

};
