var formResizer = {

  counter: 1,

  _getLastFieldSet: function () {
    var fields    = document.getElementsByTagName("fieldset");
    var lastfield = fields.item(fields.length - 1);
    return lastfield;
  },

  addItem: function () {
    var newfield = "";

    newfield += '<fieldset class"field" id="field-' + formResizer.counter +
                '">\n<input type="text" style="width: 20em;"/>\n';

    newfield += '<button type="button" onclick="javascript:formResizer.removeItem(' + formResizer.counter +
                ');">Remove this item</button>\n';

    newfield += '</fieldset>';
    document.getElementById("edit-form").innerHTML += newfield;
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
  var x = $('form#' + name).serializeJSON();
  console.log(x);
  return x;
}
