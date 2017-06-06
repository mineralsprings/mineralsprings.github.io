is_buffet = false;

var editMenuForm = {
  formResizer: {

    counter: 1,

    _getLastFieldSet: function () {
      var fields    = document.getElementsByTagName("fieldset");
      return fields.item(fields.length - 1);
    },

    addItem: function () {
      var newname =  'field-' + editMenuForm.formResizer.counter;
      var newfield = '<fieldset class="menu-field" id="' + newname + '" name="' + newname + '">\n';

      newfield +=
          '<label class="menu-itemname"> Item name:' +
            '<input class="menu-itemname-input" type="text" name="' + newname + '-name" value=""/>' +
          '</label>' +

          '<label class="menu-itemdesc"> Description:' +
            '<textarea class="menu-itemdesc-input" type="text" name="' + newname + '-desc" value=""/>' +
          '</textarea></label>'
          +
          '<label class="menu-itemprice" style="display: ' + (is_buffet ? "none" : "inline") + ';">'
          + 'Price:' +
            '<input class="menu-itemprice-input" type="number" name="' + newname + '-price" value="" />' +
          '</label>' +

          '<label class="menu-itemoptions" id="' + newname + '-special-checkbox">' +
            'Options?' +
            '<input class="menu-itemoptions-input" type="checkbox" name="' + newname + '-options" value=""/>' +
          '</label>';

      newfield += '<button type="button" onclick="editMenuForm.formResizer.removeItem('
                  + editMenuForm.formResizer.counter + ');">Remove this item</button>\n';

      newfield += '</fieldset>';
      document.getElementById("menu-form").insertAdjacentHTML('beforeend', newfield);
      ++editMenuForm.formResizer.counter;

      document.getElementById(newname + "-special-checkbox").addEventListener("click", function (e) {
        if ("INPUT" === e.target.nodeName) {
          editMenuForm.doSpecialCheckBox(e.target.parentElement);
        }
      })
    },

    removeLast: function () {
      var lastfield = editMenuForm.formResizer._getLastFieldSet();
      if ( null === lastfield || lastfield.id.match(/default/) ) {
        editMenuForm.formResizer.counter = 1;
        return;
      }
      // don't modify the counter here though
      lastfield.parentNode.removeChild(lastfield);
    },

    removeItem: function (n) {
      --editMenuForm.formResizer.counter;
      if (0 === n) { return; }
      var elem = document.getElementById("field-" + n);
      elem.parentNode.removeChild(elem);
    }
  },

  formExtract: function (name) {
    var items = {};
    var formfs = document.getElementsByTagName("fieldset");
    for (var j = 0; j < formfs.length; j++) {
      var fs = formfs[i];
      var res = {};
      var rlvnt_tags = Object.assign(
        {},
        fs.getElementsByTagName("input"),
        fs.getElementsByTagName("textarea")
      );

      for (var i = 0; i < rlvnt_tags.length; i++) {
        var intag = rlvnt_tags[i],
              val = intag.type === "checkbox" ? intag.checked : intag.value;
              nme = intag.name;
        res[nme]  = val;
      }
      items[fs.id] = res;
    }
    items.is_buffet = document.getElementById("is_buffet").checked;
    console.log(items)
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
    var box   = document.getElementById("is_buffet"),
    checked   = box.checked;
    is_buffet = checked;

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
  }
}