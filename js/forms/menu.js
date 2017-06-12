is_buffet = false;

var editMenuForm = {
  formResizer: {

    counter: 1,

    _getLastFieldSet: function () {
      var    fields = document.getElementsByTagName("fieldset");
      return fields.item(fields.length - 1);
    },

    _getRemoveButton: function (n) {
      if ("last" === n) {
        var buttons = document.getElementsByClassName("fc-removethis");
        return buttons.item(buttons.length - 1);
      }
      return document.getElementById("fc-removethis-" + n);
    },

    addItem: function () {
      var newname =  'field-' + this.counter;
      var newfield =
        '<fieldset class="menu-field" id="' + newname + '" name="' + newname + '">\n' +
          '<label class="menu-itemname"> Item name' +
            '<input class="menu-itemname-input" type="text" name="' + newname + '-name" value=""/>' +
          '</label>' +

          '<label class="menu-itemdesc"> Description' +
            '<textarea class="menu-itemdesc-input" type="text" name="' + newname + '-desc" value=""/>' +
          '</textarea></label>'
          +
          '<label class="menu-itemprice" style="display: ' + (is_buffet ? "none" : "inline") + ';">'
          + 'Price' +
            '<input class="menu-itemprice-input" type="number" name="' + newname + '-price" value="" />' +
          '</label>' +

          '<label class="menu-itemoptions" id="' + newname + '-special-checkbox">' +
            'Options?' +
            '<input class="menu-itemoptions-input" type="checkbox" name="' + newname + '-options" value=""/>' +
          '</label></fieldset>';

      var newbutton = '<button class="fc-button fc-removethis" type="button" id="fc-removethis-' +
        this.counter + '" onclick="editMenuForm.formResizer.removeItem(' +
        this.counter + ');"> - </button><br>\n';

      document.getElementById("menu-wrapper")
        .insertAdjacentHTML("beforeend", newfield);
      document.getElementById("menu-fc-buttons-col-right")
        .insertAdjacentHTML("beforeend", newbutton);
      ++this.counter;

      document.getElementById(
          newname + "-special-checkbox"
      ).addEventListener("click", doOptionsCheckBox);
    },

    removeLast: function () {
      var lastfield = this._getLastFieldSet();
      if ( null === lastfield || lastfield.id.match(/default/) ) {
        this.counter = 1;
        return;
      }
      // don't modify the counter here though
      lastfield.parentNode.removeChild(lastfield);
      var lastbutton = this._getRemoveButton("last");
      lastbutton.parentNode.removeChild(lastbutton);
    },

    removeItem: function (n) {
      --this.counter;
      /*if (0 === n) { return; }*/
      var elem = document.getElementById("field-" + n);
      elem.parentElement.removeChild(elem);
      var button = this._getRemoveButton(n);
      button.parentElement.removeChild(button);
    }
  },

  doSpecialCheckBox: function (label) {
    var cbox     = label.getElementsByTagName("input")[0],
        checked  = cbox.checked,
        topfield = label.parentElement;

    var optform = '<fieldset class="options-field" name="'
                  + cbox.name + '-fieldset" id="' + cbox.name + '-fieldset">';

    for (var i = 0; i < 3; i++) {
      optform += "<label class='options-name'>Name:" +
                    "<input type='text' name='" + cbox.name + "-options" + i + "-name'/>" +
                  "</label>";

      if (! is_buffet) {
        optform += "<label class='options-price'>Price:" +
                      "<input type='number' name='" + cbox.name + "-options" + i + "-price'/>" +
                    "</label>";
      }
      optform += "<br>\n";
    }

    optform += "</fieldset>";

    if (checked) {
      topfield.insertAdjacentHTML("beforeend", optform);
    } else {
      var optfs_name = cbox.name + "-fieldset",
               optfs = document.getElementById(optfs_name);

      optfs.parentElement.removeChild(optfs);

    }
  },

  doBuffetBox: function () {
    var checked = document.getElementById("is_buffet").checked;
    /* global */ is_buffet = checked;

    var warn = document.getElementById("buffet_warn");
    if (checked) {
      warn.removeAttribute("hidden")
    } else {
      warn.setAttribute("hidden", true)
    }

    var inputs = document.getElementsByTagName("input");
    for (var j = 0; j < inputs.length; j++) {
      var ip = inputs[j];
      if (ip.name.match(/price$/)) {
        ip.parentNode.style.display = checked ? "none" : "inline";
      }
    }
  },

  formExtract: function () {
    var all_items = {};
    var top_forms = document.getElementsByTagName("fieldset");
    for (var j = 0; j < top_forms.length; j++) {
      var local_result = {};
      var fs = top_forms[j];
      var need_tags = spread(
        fs.getElementsByTagName("input"),
        fs.getElementsByTagName("textarea")
      );

      for (var i = 0; i < need_tags.length; i++) {
        var intag = need_tags[i];
        local_result[intag.name] =
          intag.type === "checkbox"
            ? intag.checked.toString()
            : intag.value;
      }
      all_items[fs.id] = local_result;
    }
    all_items.is_buffet = document.getElementById("is_buffet").checked.toString();
    //console.log(all_items);
    return all_items;
  },

  doProcessMenuForm: function () {
    var items = this.formExtract();
    console.log(JSON.stringify(items));
    httpPostAsync(
      getServerHostForEnv(),
      function (r) { console.log(r); },
      function () { console.log("form not ok"); },
      JSON.stringify(defaultJSONObjs.edit_menu(items))
    );
  }
}
