is_buffet = false;

var editMenuForm = {
  formResizer: {

    counter: 1,

    _getLastFieldSet: function () {
      var fields    = document.getElementsByTagName("fieldset");
      var lastfield = fields.item(fields.length - 1);
      return lastfield;
    },

    addItem: function () {
      var newname =  'field-' + editMenuForm.formResizer.counter;
      var newfield = "";

      newfield = '<fieldset class="field" id="' + newname + '" name="' + newname + '">\n';

      newfield += `
          <label>
            Item name:
            <input type="text" name="` + newname + `-name" value=""/>
          </label>
          <label>
            Description:
            <textarea type="text" name="` + newname + `-desc" value=""/></textarea>
          </label>`
          +/* (is_buffet ? `` : */`
          <label>
            Price:
            <input type="number" name="` + newname + `-price" value=""/>
          </label>
          `/*)*/ +
          `<label onclick="editMenuForm.doSpecialCheckBox(this)">
            Options?
            <input type="checkbox" name="` + newname + `-options" value=""/>
          </label>`;

      newfield += '<button type="button" onclick="editMenuForm.formResizer.removeItem(' + editMenuForm.formResizer.counter +
                  ');">Remove this item</button>\n';

      newfield += '</fieldset>';
      document.getElementById("menu-form").insertAdjacentHTML('beforeend', newfield);
      ++editMenuForm.formResizer.counter;
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
    for (fs of document.getElementsByTagName("fieldset")) {
      var res = {};
      for (intag of fs.getElementsByTagName("input")) {
        var val = intag.type === "checkbox" ? intag.checked : intag.value;
        var nme = intag.name;
        res[nme] = val;
      }
      items[fs.id] = res;
    }
    console.log(items)
  },

  doSpecialCheckBox: function (label) {
    var cbox     = label.getElementsByTagName("input")[0],
        checked  = cbox.checked,
        topfield = label.parentElement;

    console.log(cbox.name);

    var optform = `
      <fieldset class="field" name="` + cbox.name + `-fieldset" id="` + cbox.name + `-fieldset">
        <label class='options-label'>
          Name:
          <input type='text' name='` + cbox.name + `-options0-name'/>
        </label>

        <label class='options-label'>
          Price:
          <input type='number' name='` + cbox.name + `-options0-price'/>
        </label>

        <br>

        <label class='options-label'>
          Name:
          <input type='text' name='` + cbox.name + `-options1-name'/>
        </label>

        <label class='options-label'>
          Price:
          <input type='number' name='` + cbox.name + `-options1-price'/>
        </label>

        <br>

        <label class='options-label'>
          Name:
          <input type='text' name='` + cbox.name + `-options2-name'/>
        </label>

        <label class='options-label'>
          Price:
          <input type='number' name='` + cbox.name + `-options2-price'/>
        </label>
      </fieldset>`;

    if (checked) {
      topfield.insertAdjacentHTML("beforeend", optform);
    } else {
      var optfs_name = cbox.name + "-fieldset",
               optfs = document.getElementById(optfs_name);

      console.log(optfs_name);

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
    for (i of inputs) {
      if (i.name.match(/price$/)) {
        i.parentNode.style.display = checked ? "none" : "inline";
      }
    }
  }
}