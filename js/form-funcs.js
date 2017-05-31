var formResizer = {

  counter: 1,

  _getLastFieldSet: function () {
    var fields    = document.getElementsByTagName("fieldset");
    var lastfield = fields.item(fields.length - 1);
    return lastfield;
  },

  addItem: function () {
    var newname =  'field-' + formResizer.counter;
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
        <label>
          Options?
          <input type="checkbox" name="` + newname + `-options" value=""/>
        </label>`;

    newfield += '<button type="button" onclick="javascript:formResizer.removeItem(' + formResizer.counter +
                ');">Remove this item</button>\n';

    newfield += '</fieldset>';
    document.getElementById("edit-form").insertAdjacentHTML('beforeend', newfield);
    ++formResizer.counter;
  },

  removeLast: function () {
    var lastfield = formResizer._getLastFieldSet();
    if (null === lastfield) { return; }
    lastfield.parentNode.removeChild(lastfield);
  },

  removeItem: function (n) {
    --formResizer.counter;
    if (0 === n) { return; }
    var elem = document.getElementById("field-" + n);
    elem.parentNode.removeChild(elem);
  }
}

function formExtract(name) {
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
}
