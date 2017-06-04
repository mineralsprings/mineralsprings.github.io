var editOrderForm = {
  formResizer: {

    counter: 1,

    _getLastFieldSet: function () {
      var fields    = document.getElementsByTagName("fieldset");
      var lastfield = fields.item(fields.length - 1);
      return lastfield;
    },

    addItem: function () {
      var newname =  'field-' + editOrderForm.formResizer.counter;
      var newfield = "";

      newfield = '<fieldset class="field" id="' + newname + '" name="' + newname + '">\n';

      newfield += `
          <label>
            Item name:
            <input type="text" name="` + newname + `-name" value=""/>
          </label>
          <label>
            Description:
            <input type="textarea" name="` + newname + `-desc" value=""/>
          </label>
          <label>
            Price:
            <input type="number" name="` + newname + `-price" value=""/>
          </label>
          <label onclick="editOrderForm.doSpecialCheckBox(this)">
            Options?
            <input type="checkbox" name="` + newname + `-options" value=""/>
          </label>`;

      newfield += '<button type="button" onclick="editOrderForm.formResizer.removeItem(' + editOrderForm.formResizer.counter +
                  ');">Remove this item</button>\n';

      newfield += '</fieldset>';
      document.getElementById("edit-form").insertAdjacentHTML('beforeend', newfield);
      ++editOrderForm.formResizer.counter;
    },

    removeLast: function () {
      var lastfield = editOrderForm.formResizer._getLastFieldSet();
      if ( null === lastfield || lastfield.id.match(/default/) ) {
        editOrderForm.formResizer.counter = 1;
        return;
      }
      // don't modify the counter here though
      lastfield.parentNode.removeChild(lastfield);
    },

    removeItem: function (n) {
      --editOrderForm.formResizer.counter;
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

  doSpecialCheckBox: function (ctx) {
    var cbox    = ctx.getElementsByTagName("input")[0],
        checked = cbox.checked,
        parent  = ctx.parentNode;

    var optform = `
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
      `;

    if (checked) {
      parent.insertAdjacentHTML("beforeend", optform);
    } else {
      parent.removeChild(document.getElementById(cbox.name + "-fieldset"))
    }
  },

  testFormsOffline: function (elv) {
    currentGoogleUser = { nih_info: { is_elevated: elv } };
    afterGLoginWriter();
  }
}